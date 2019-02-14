import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { Songgroup } from '../models/songgroup';
import { DexieService } from './dexie.service';
import { Song } from '../models/song';
import { MergeService } from './merge.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
import { FILESYSTEM } from '../models/filesystem';
import { StoreService } from './store.service';

const uuid = require('uuid/v1');

@Injectable()
export class FileSynchronizerService {

  constructor(
    private storeService: StoreService,
    private mergeService: MergeService,
    private router: Router,
    private configService: ConfigService
  ) {
    this.pathGuard().then(mainPath => {
      this.storeService.mainDirectory = mainPath;
      this.storeService.createFileIndex();
    });
  }

  private upsertSonggroup(filePath: string, data: Songgroup): Promise<Songgroup> {
    return this.storeService.createFile(filePath, data).then(() => {
      return new Promise<Songgroup>(resolve => resolve(data));
    });
  }

  private upsertSong(filePath: string, data: Song): Promise<Song> {
    return new Promise((resolve, reject) => {
      this.storeService
      .updateFile(filePath, data)
      .then(() => resolve(data))
      .catch((err) => {
        if (err === 'The given resource has not been initialized') {
          return this.storeService.createFile(filePath, data);
        } else if (err.indexedFile && err.currentFile) {
          console.log(err);
          return this.mergeService
            .mergeSong(err.indexedFile, err.currentFile, data)
            .then(song => {
            if (song) {
              return this.upsertSong(filePath, <Song>song);
            }
            return;
          });
        }
      });
    });
  }

  public getSongs(): Song[] {
    return <Song[]>this.storeService.getAll(DATABASES.songs);
  }

  public getSong(songid: string): Song {
    return <Song>this.storeService.getByKey(DATABASES.songs, songid);
  }

  public saveSong(song: Song): Promise<Song> {
    if (!song.id) {
      song.id = uuid();
    }
    return this.pathGuard().then(mainPath => {
      return this.upsertSong(this.pathJoin(mainPath, DATABASES.songs, song.id + '.song'), song).then(s => {
        if (s) {
            return new Promise<Song>(resolve => resolve(<Song>s));
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
      return this.storeService
        .deleteFile(this.pathJoin(mainPath, DATABASES.songs, songid + '.song'));
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
    });
  }

  public getSonggroups(): Songgroup[] {
    return <Songgroup[]>this.storeService.getAll(DATABASES.songgroups);
  }

  public getSonggroup(songgroupid: string): Songgroup {
    return <Songgroup>this.storeService.getByKey(DATABASES.songgroups, songgroupid);
  }

  public saveSonggroup(songgroup: Songgroup): Promise<Songgroup> {
    if (!songgroup.id) {
      songgroup.id = uuid();
    }
    return this.pathGuard().then(mainPath => {
      return this.upsertSonggroup(this.pathJoin(mainPath, DATABASES.songgroups, songgroup.id + '.songgroup'), songgroup);
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Songgroup>(resolve => resolve());
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.pathGuard().then(mainPath => {
      return this.storeService.deleteFile(
          this.pathJoin(mainPath, DATABASES.songgroups, songgroupid + '.songgroup')
        );
    });
  }

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
