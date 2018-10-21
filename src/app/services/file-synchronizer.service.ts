import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { MergeService } from './merge.service';
import { Songgroup } from '../models/songgroup';
import { DexieService } from './dexie.service';
import { Song } from '../models/song';

const path = require('path');

@Injectable()
export class FileSynchronizerService {

  constructor(
    private dexieService: DexieService,
    private apiService: ApiService,
    private mergeService: MergeService
  ) {
    this.syncAllFiles();
  }

  private syncAllFiles() {
    this.syncFilesIndexedDB(); // only from filesystem to db: files determine content!!!
  }

  private syncFilesIndexedDB(): Promise<any> {
    return this.apiService.generateFileSystemIndex().then(res => {
      this.dexieService.clear(DATABASES.songs);
      this.dexieService.clear(DATABASES.songgroups);
      res.payload.forEach(filePath => {
        const file = filePath.replace(this.apiService.getPath(), '');
        if (file.startsWith(DATABASES.songs)) {
          this.syncOneFileIndexedDB(DATABASES.songs, filePath);
        } else if (file.startsWith(DATABASES.songgroups)) {
          this.syncOneFileIndexedDB(DATABASES.songgroups, filePath);
        }
      });
    });
  }

  private syncOneFileIndexedDB(dbType: DATABASES, filePath: string) {
    filePath = filePath.replace(this.apiService.getPath(), '');
    const id = filePath.replace('.songgroup', '').replace('.song', '');
    this.dexieService.getByKey(dbType, id).then(object => {
      this.apiService.generateFileLoadRequest<JSON>(filePath, true).then(response => {
        switch (response.status) {
          case 200:
            this.dexieService.upsert(dbType, response.payload.data);  // filesystem determines data!!!
            break;
          default:
            console.log(response, filePath, dbType);
        }
      });
    });
  }

  private upsertFile<T>(filePath: string, data: T): Promise<T> {
    return this.apiService.generateFileUpdateRequest(filePath, data).then( res => {
      console.log('upsert file', res);
      switch (res.status) {
        case 201:
          return new Promise<T>(resolve => resolve(data));
        case 300:
          let merged;
          merged = this.mergeService.merge(res.payload.indexedVersion, res.payload.currentVersion, data);
          return this.upsertFile<T>(filePath, merged);
        case 404:
          return this.apiService.generateFileCreateRequest(filePath, data).then(response => {
            return new Promise<T>(resolve => resolve(data));
          });
      }
    });
  }

  public getSongs(): Promise<Song[]> {
    return this.dexieService.getAll(DATABASES.songs).then(res => {
      return this.map<Song>(res);
    });
  }

  public getSong(songid: string): Promise<Song> {
    return this.dexieService.getByKey(DATABASES.songs, songid).then(res => {
      return this.map<Song>(res);
    });
  }

  public saveSong(song: Song): Promise<Song> {
    return this.dexieService.upsert(DATABASES.songs, song).then(() => {
      return this.upsertFile<Song>(path.join(DATABASES.songs, song.id + '.song'), song);
    });
  }

  public deleteSong(songid: string) {
    return this.dexieService.delete(DATABASES.songs, songid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songs, songid + '.song'));
    });
  }

  public getSonggroups(): Promise<Songgroup[]> {
    return this.dexieService.getAll(DATABASES.songgroups).then(res => {
      return this.map<Songgroup>(res);
    });
  }

  public getSonggroup(songgroupid: string): Promise<Songgroup> {
    return this.dexieService.getByKey(DATABASES.songgroups, songgroupid).then(res => {
      return this.map<Songgroup>(res);
    });
  }

  public saveSonggroup(songgroup: Songgroup): Promise<Songgroup> {
    return this.dexieService.upsert(DATABASES.songgroups, songgroup).then(res => {
      return this.upsertFile<Songgroup>(path.join(DATABASES.songgroups, songgroup.id + '.songgroup'), songgroup);
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.dexieService.delete(DATABASES.songgroups, songgroupid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songgroups, songgroupid + '.songgroup'));
    });
  }

  private map<T>(array) {
    if (array && array.length > 0) {
      return array.map(value => <T>value);
    } else {
      return [];
    }
  }
}
