const uuid = require('uuid/v1');

import { Injectable, EventEmitter } from '@angular/core';
import { DATABASES } from '../models/databases';
import { IndexedDBChange } from '../models/indexedDBChange';
import Dexie from 'dexie';

@Injectable()
export class DexieService {

  private dexie;

  public changes = new EventEmitter<IndexedDBChange>();

  constructor() {
    this.dexie = new Dexie('songsheet');
    const stores = {};
    stores[DATABASES.settings] = '&id';
    stores[DATABASES.songs] = '&id';
    stores[DATABASES.songgroups] = '&id';
    this.dexie.version(1).stores(stores);
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

    return this.getByKey(database, data.id).then(obj => {
      if (obj) {
        return this.dexie[database]
          .update(data.id, data)
          .then(() => this.changes.emit(new IndexedDBChange()))
          .catch(err => console.log(err));
      } else {
        return this.dexie[database]
          .add(data)
          .then(() => this.changes.emit(new IndexedDBChange()))
          .catch(err => console.log(err));
      }
    });
  }

  getAll(database: DATABASES) {
    return this.dexie[database].toArray();
  }

  getByKey(database: DATABASES, key: string) {
    if (key) {
      return this.dexie[database].get(key);
    } else {
      return Promise.reject();
    }
  }

  delete(database: DATABASES, key: string) {
    return this.dexie[database].delete(key).then(() => this.changes.emit(new IndexedDBChange()));
  }

  clear(database: DATABASES) {
    return this.dexie[database].clear().then(() => this.changes.emit(new IndexedDBChange()));
  }
}
