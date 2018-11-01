import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { Songgroup } from '../models/songgroup';
import { DexieService } from './dexie.service';
import { Song } from '../models/song';
import { MergeService } from './merge.service';

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
        }
      });
    });
  }

  private upsertSonggroup(filePath: string, data: Songgroup): Promise<Songgroup> {
    return this.apiService.generateFileCreateRequest(filePath, data).then(res => {
      return new Promise<Songgroup>(resolve => resolve(data));
    });
  }

  private upsertSong(filePath: string, data: Song): Promise<Song> {
    return this.apiService.generateFileUpdateRequest(filePath, data).then( res => {
      console.log(res);
      switch (res.status) {
        case 201:
          return new Promise<Song>(resolve => resolve(data));
        case 300:
          return this.mergeService.mergeSong(res.payload.indexedVersion, res.payload.currentVersion, data).then(song => {
            console.log(song);
            return this.upsertSong(filePath, <Song>song);
          });
        case 404:
          return this.apiService.generateFileCreateRequest(filePath, data).then(response => {
            return new Promise<Song>(resolve => resolve(data));
          });
      }
    });
  }

  public getSongs(): Promise<Song[]> {
    return this.dexieService.getAll(DATABASES.songs).then(res => {
      return this.cast<Song>(res);
    });
  }

  public getSong(songid: string): Promise<Song> {
    return this.dexieService.getByKey(DATABASES.songs, songid).then(res => {
      return <Song>res;
    });
  }

  public saveSong(song: Song): Promise<Song> {
    console.log(song);
    return this.upsertSong(path.join(DATABASES.songs, song.id + '.song'), song).then(s => {
      console.log(s);
      return this.dexieService.upsert(DATABASES.songs, s).then(() => {
        return new Promise<Song>(resolve => resolve(<Song>s));
      });
    });
  }

  public deleteSong(songid: string) {
    return this.dexieService.delete(DATABASES.songs, songid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songs, songid + '.song'));
    });
  }

  public getSonggroups(): Promise<Songgroup[]> {
    return this.dexieService.getAll(DATABASES.songgroups).then(res => {
      return this.cast<Songgroup>(res);
    });
  }

  public getSonggroup(songgroupid: string): Promise<Songgroup> {
    return this.dexieService.getByKey(DATABASES.songgroups, songgroupid).then(res => {
      return <Songgroup>res;
    });
  }

  public saveSonggroup(songgroup: Songgroup): Promise<Songgroup> {
    return this.dexieService.upsert(DATABASES.songgroups, songgroup).then(res => {
      return this.upsertSonggroup(path.join(DATABASES.songgroups, songgroup.id + '.songgroup'), songgroup);
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.dexieService.delete(DATABASES.songgroups, songgroupid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songgroups, songgroupid + '.songgroup'));
    });
  }

  private cast<T>(array): Array<T> { return (array || []).map(value => <T>value); }
}
