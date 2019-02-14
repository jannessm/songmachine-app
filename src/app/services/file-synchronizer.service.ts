import { Injectable } from '@angular/core';
import { DATABASES } from '../models/databases';
import { Songgroup } from '../models/songgroup';
import { Song } from '../models/song';
import { MergeService } from './merge.service';
import { Router } from '@angular/router';
import { ConfigService } from './config.service';
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

  private upsertSonggroup(data: Songgroup): Promise<Songgroup> {
    return this.storeService.createFile(DATABASES.songgroups, data).then(() => {
      return new Promise<Songgroup>(resolve => resolve(data));
    });
  }

  private upsertSong(data: Song): Promise<Song> {
    return new Promise((resolve, reject) => {
      this.storeService
      .updateFile(DATABASES.songs, data)
      .then(() => resolve(data))
      .catch((err) => {
        if (err === 'The given resource has not been initialized') {
          this.storeService.createFile(DATABASES.songs, data)
            .then(() => resolve(data), error => reject(error));
        } else if (err.indexedFile && err.currentFile) {
          console.log(err);
          return this.mergeService
            .mergeSong(err.indexedFile, err.currentFile, data)
            .then(song => {
              if (song) {
                return this.upsertSong(<Song>song);
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
    return this.pathGuard().then(() => {
      return this.upsertSong(song).then(s => {
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

  public deleteSong(songid: string): Promise<void> {
    return this.pathGuard()
      .then(() => this.storeService.deleteFile(DATABASES.songs, songid))
      .catch(() => {
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
    return this.pathGuard().then(() => {
      return this.upsertSonggroup(songgroup);
    }).catch(() => {
      // no path defined
      this.router.navigateByUrl('/settings');
      return new Promise<Songgroup>(resolve => resolve());
    });
  }

  public deleteSonggroup(songgroupid: string) {
    return this.pathGuard().then(() => {
      return this.storeService.deleteFile(DATABASES.songgroups, songgroupid);
    });
  }

  private pathGuard(): Promise<string> {
    return new Promise((res, rej) => {
      const root = this.configService.get('defaultPath');
      if (root) {
        res(root);
      } else {
        rej('no defaultPath defined');
      }
    });
  }
}
