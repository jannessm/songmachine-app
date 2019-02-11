import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { Songgroup } from '../models/songgroup';
import { DexieService } from './dexie.service';
import { Song } from '../models/song';
import { MergeService } from './merge.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { FILESYSTEM } from '../models/filesystem';

const uuid = require('uuid/v1');

@Injectable()
export class FileSynchronizerService {

  constructor(
    private dexieService: DexieService,
    private apiService: ApiService,
    private mergeService: MergeService,
    private router: Router,
    private configService: ConfigService
  ) {
    this.syncFilesIndexedDB(); // only from filesystem to db: files determine content!!!
  }

  public syncFilesIndexedDB(): Promise<any> {
    this.dexieService.clear(DATABASES.songs);
    this.dexieService.clear(DATABASES.songgroups);
    return this.pathGuard().then(mainPath => {
      return Object.keys(this.apiService.createFileIndex(mainPath).loadSongFiles().fileMap).forEach(filePath => {
        const file = filePath.replace(mainPath, '');
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
    this.dexieService.upsert(dbType, this.apiService.loadFile(filePath));  // filesystem determines data!!!
  }

  private upsertSonggroup(filePath: string, data: Songgroup): Promise<Songgroup> {
    return this.apiService.createFile(filePath, JSON.stringify(data, null, 2)).then(() => {
      return new Promise<Songgroup>(resolve => resolve(data));
    });
  }

  private upsertSong(filePath: string, data: Song): Promise<Song> {
    return this.apiService
      .updateFile(filePath, data)
      .then(() => new Promise<Song>(resolve => resolve(data)))
      .catch((err) => {
        return this.mergeService
          .mergeSong(err.indexedVersion, err.currentVersion, data)
          .then(song => {
          if (song) {
            return this.upsertSong(filePath, <Song>song);
          }
          return;
        });
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
    return this.pathGuard().then(mainPath => {
      return this.upsertSong(this.pathJoin(mainPath, DATABASES.songs, song.id + '.song'), song).then(s => {
        if (s) {
          return this.dexieService.upsert(DATABASES.songs, s).then(() => {
            return new Promise<Song>(resolve => resolve(<Song>s));
          });
        }
      });
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Song>(resolve => resolve());
    });
  }

  public deleteSong(songid: string) {
    return this.pathGuard().then(mainPath => {
      return this.apiService
        .deleteFile(this.pathJoin(mainPath, DATABASES.songs, songid + '.song'))
        .then(res => {
          if (res.status === 200) {
            return this.dexieService.delete(DATABASES.songs, songid);
          }
        });
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
    return this.pathGuard().then(mainPath => {
      return this.upsertSonggroup(this.pathJoin(mainPath, DATABASES.songgroups, songgroup.id + '.songgroup'), songgroup).then(res => {
        if (res) {
          return this.dexieService.upsert(DATABASES.songgroups, res).then(() => new Promise<Songgroup>(resolve => resolve(songgroup)));
        } else {
          return new Promise<Songgroup>(resolve => resolve());
        }
      });
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Songgroup>(resolve => resolve());
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.pathGuard().then(mainPath => {
      return this.apiService.deleteFile(
          this.pathJoin(mainPath, DATABASES.songgroups, songgroupid + '.songgroup')
        ).then(() => {
          this.dexieService.delete(DATABASES.songgroups, songgroupid);
     });
    });
  }

  private cast<T>(array): Array<T> { return (array || []).map(value => <T>value); }

  private pathGuard(): Promise<string> {
    return new Promise((res, rej) => {
      const root = this.configService.get('defaultPath');
      if (root) {
        const p = this.pathJoin(root, FILESYSTEM.DATA, '');
        res(p);
      } else {
        rej('no defaultPath defined');
      }
    });
  }

  private pathJoin(...args: string[]): string {
    let delimiter = '/';
    if (/Win/gi.test(navigator.platform)) {
      delimiter = '\\';
    }
    return args.reduce((path, val) => {
      if (path !== '' && path[path.length - 1] !== delimiter) {
        path += delimiter;
      }
      return path + val;
    }, '');
  }
}
