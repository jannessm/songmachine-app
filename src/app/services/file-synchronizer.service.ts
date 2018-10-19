import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { ConfigService } from './config.service';
import { FILESYSTEM } from '../models/filesystem';
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
    private configService: ConfigService,
    private mergeService: MergeService
  ) {
    this.syncAllFiles();
  }

  private syncAllFiles() {
    this.syncFilesIndexedDB().then(files => this.syncIndexedDBFiles(files));
  }

  private syncFilesIndexedDB(): Promise<any> {
    return this.apiService.generateFileSystemIndex().then(res => {
      return new Promise((resolve, reject) => {
        res.payload.forEach(filePath => {
          const file = filePath.replace(this.apiService.getPath(), '');
          if (file.startsWith(DATABASES.songs)) {
            this.syncOneFileIndexedDB(DATABASES.songs, filePath);
          } else if (file.startsWith(DATABASES.songgroups)) {
            this.syncOneFileIndexedDB(DATABASES.songgroups, filePath);
          }
        });
        resolve(res.payload);
      });
    });
  }

  private syncIndexedDBFiles(files: string[]) {
    files = files.map(file => file.replace(this.apiService.getPath(), ''));

    this.dexieService.getAll(DATABASES.songs).then(songs => {
      songs.forEach(song => {
        const filtered = files.filter(file => file.indexOf(song.id) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(
            path.join(FILESYSTEM.SONGS, song.id + '.song'), song
          ).then(res => {
            console.log('songs added to filesystem', res);
          });
        }
      });
    });

    this.dexieService.getAll(DATABASES.songgroups).then(songgroups => {
      songgroups.forEach(songgroup => {
        const filtered = files.filter(file => file.indexOf(songgroup.id) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(
            path.join(FILESYSTEM.SONGGROUPS, songgroup.id + '.songgroup'), songgroup
          ).then(res => {
            console.log('songgroups added to filesystem', res);
          });
        }
      });
    });
  }

  private syncOneFileIndexedDB(dbType: DATABASES, filePath: string) {
    const file = filePath.replace(this.apiService.getPath(), '').replace('.songgroup', '').replace('.song', '');

    this.dexieService.getByKey(dbType, file).then(object => {
      this.apiService.generateFileLoadRequest<JSON>(filePath, true).then(response => {
        if (object) {
          this.mergeService.mergeSongs(object, response.payload);
        } else {
          this.dexieService.upsert(dbType, response.payload.data);
        }
      });
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

  public saveSong(song: Song) {
    return this.dexieService.upsert(DATABASES.songs, song);
  }

  public deleteSong(songid: string) {
    return this.dexieService.delete(DATABASES.songs, songid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songs, songid, '.song'));
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

  public saveSonggroup(songgroup: Songgroup) {
    return this.dexieService.upsert(DATABASES.songgroups, songgroup);
  }

  public deleteSonggroup(songgroupid: string) {
    return this.dexieService.delete(DATABASES.songgroups, songgroupid).then(() => {
      this.apiService.generateDeleteFileRequest(path.join(DATABASES.songgroups, songgroupid, '.songgroup'));
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
