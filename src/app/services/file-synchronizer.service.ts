import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { Songgroup } from '../models/songgroup';
import { DexieService } from './dexie.service';
import { Song } from '../models/song';
import { MergeService } from './merge.service';
import { Router } from '@angular/router';

const path = require('path');
const uuid = require('uuid/v1');

@Injectable()
export class FileSynchronizerService {

  constructor(
    private dexieService: DexieService,
    private apiService: ApiService,
    private mergeService: MergeService,
    private router: Router
  ) {
    this.syncFilesIndexedDB(); // only from filesystem to db: files determine content!!!
  }

  public syncFilesIndexedDB(): Promise<any> {
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
    }).catch(() => {
      // no path defined => ignore so songs are empty
    });
  }

  private syncOneFileIndexedDB(dbType: DATABASES, filePath: string) {
    filePath = filePath.replace(this.apiService.getPath(), '');
    this.apiService.generateFileLoadRequest<JSON>(filePath).then(response => {
      switch (response.status) {
        case 200:
          this.dexieService.upsert(dbType, response.payload.data);  // filesystem determines data!!!
          break;
      }
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
    });
  }

  private upsertSonggroup(filePath: string, data: Songgroup): Promise<Songgroup> {
    return this.apiService.generateFileCreateRequest(filePath, data).then(res => {
      return new Promise<Songgroup>(resolve => resolve(data));
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Songgroup>(resolve => resolve());
    });
  }

  private upsertSong(filePath: string, data: Song): Promise<Song> {
    return this.apiService.generateFileUpdateRequest(filePath, data).then( res => {
      switch (res.status) {
        case 201:
          return new Promise<Song>(resolve => resolve(data));
        case 300:
          return this.mergeService.mergeSong(res.payload.indexedVersion, res.payload.currentVersion, data).then(song => {
            return this.upsertSong(filePath, <Song>song);
          });
        case 404:
          return this.apiService.generateFileCreateRequest(filePath, data).then(response => {
            return new Promise<Song>(resolve => resolve(data));
          });
      }
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Song>(resolve => resolve());
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
    if (!song.id) {
      song.id = uuid();
    }
    return this.upsertSong(path.join(DATABASES.songs, song.id + '.song'), song).then(s => {
      if (s) {
        return this.dexieService.upsert(DATABASES.songs, s).then(() => {
          return new Promise<Song>(resolve => resolve(<Song>s));
        });
      }
    });
  }

  public deleteSong(songid: string) {
    return this.apiService.generateDeleteFileRequest(path.join(DATABASES.songs, songid + '.song')).then(res => {
      if (res.status === 200) {
        return this.dexieService.delete(DATABASES.songs, songid);
      }
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
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
    if (!songgroup.id) {
      songgroup.id = uuid();
    }
    return this.upsertSonggroup(path.join(DATABASES.songgroups, songgroup.id + '.songgroup'), songgroup).then(res => {
      if (res) {
        return this.dexieService.upsert(DATABASES.songgroups, res).then(() => new Promise<Songgroup>(resolve => resolve(songgroup)));
      } else {
        return new Promise<Songgroup>(resolve => resolve());
      }
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.apiService.generateDeleteFileRequest(path.join(DATABASES.songgroups, songgroupid + '.songgroup')).then(() => {
      this.dexieService.delete(DATABASES.songgroups, songgroupid);
    });
  }

  private cast<T>(array): Array<T> { return (array || []).map(value => <T>value); }
}
