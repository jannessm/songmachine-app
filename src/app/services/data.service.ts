import { Injectable } from '@angular/core';
import { FileSynchronizerService } from './file-synchronizer.service';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DATABASES } from '../models/databases';

@Injectable()
export class DataService {

  constructor(private fileSynchronizer: FileSynchronizerService) {}

  getAll(dbType: DATABASES): Song[] | Songgroup[] {
    switch (dbType) {
      case DATABASES.songs:
        return this.getSongs();
      case DATABASES.songgroups:
        return this.getSonggroups();
    }
  }

  saveType(dbType: DATABASES, data): Promise<Song|Songgroup> {
    switch (dbType) {
      case DATABASES.songs:
        return this.saveSong(data);
      case DATABASES.songgroups:
        return this.saveSonggroup(data);
    }
  }

  getSongs(): Song[] {
    return this.fileSynchronizer.getSongs();
  }

  getSonggroups(): Songgroup[] {
    return this.fileSynchronizer.getSonggroups();
  }

  getSong(songid: string): Song {
    return this.fileSynchronizer.getSong(songid);
  }

  saveSong(song: Song): Promise<Song> {
    return this.fileSynchronizer.saveSong(song);
  }

  deleteSong(songid: string) {
    this.fileSynchronizer.deleteSong(songid);
  }

  getSonggroup(songgroupid: string): Songgroup {
    return this.fileSynchronizer.getSonggroup(songgroupid);
  }

  saveSonggroup(songgroup: Songgroup): Promise<Songgroup> {
    return this.fileSynchronizer.saveSonggroup(songgroup);
  }

  deleteSonggroup(songgroupid: string) {
    this.fileSynchronizer.deleteSonggroup(songgroupid);
  }

}
