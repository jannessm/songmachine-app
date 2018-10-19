const uuid = require('uuid/v1');
import idb, { DB } from 'idb';

import { Injectable, EventEmitter } from '@angular/core';
import { DATABASES } from '../models/databases';
import { IndexedDBChange } from '../models/indexedDBChange';

@Injectable()
export class DexieService {

  private dbPromise: Promise<DB>;

  public changes = new EventEmitter<IndexedDBChange>();

  constructor() {
    this.dbPromise = idb.open('songsheet', 1, (upgradeDb) => {
      if (!upgradeDb.objectStoreNames.contains(DATABASES.settings)) {
        upgradeDb.createObjectStore(DATABASES.settings, {keyPath: 'id'});
      }
      if (!upgradeDb.objectStoreNames.contains(DATABASES.songs)) {
        upgradeDb.createObjectStore(DATABASES.songs, {keyPath: 'id'});
      }
      if (!upgradeDb.objectStoreNames.contains(DATABASES.songgroups)) {
        upgradeDb.createObjectStore(DATABASES.songgroups, {keyPath: 'id'});
      }
    });
  }

  public upsert(database: DATABASES, data: any) {
    if (typeof data !== 'object') {
      throw new Error('data is not an object. Only objects can be added to Indexeddb');
    }
    if (!data.id && database === DATABASES.settings) {
      throw new Error('Settings need an id.');
    }
    // settings has a different id property
    if (!data.id && database !== DATABASES.settings) {
      data.id = uuid();
    }

    return this.getByKey(database, data.id).then( obj => {
      return this.dbPromise.then(db => {
        const tx = db.transaction(database, 'readwrite');
        const store = tx.objectStore(database);
        store.put(data);
        this.changes.emit(new IndexedDBChange());
        return tx.complete;
      });
    }).catch(() => {
      return this.dbPromise.then(db => {
        const tx = db.transaction(database, 'readwrite');
        const store = tx.objectStore(database);
        store.add(data);
        this.changes.emit(new IndexedDBChange());
        return tx.complete;
      }).then(res => {
        console.log(res);
      });
    });
  }

  getAll(database: DATABASES) {
    return this.dbPromise.then(db => {
      return db.transaction(database, 'readonly').objectStore(database).getAll();
    });
  }

  getByKey(database: DATABASES, key: string) {
    return this.dbPromise.then(db => {
      return db.transaction(database, 'readonly').objectStore(database).get(key);
    });
  }

  delete(database: DATABASES, key: string) {
    return this.dbPromise.then(db => {
      const tx = db.transaction(database, 'readwrite');
      tx.objectStore(database).delete(key);
      this.changes.emit(new IndexedDBChange());
      if (database === DATABASES.settings) {
        return;
      }
      return tx.complete;
    });
  }
}
