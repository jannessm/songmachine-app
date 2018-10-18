import { Injectable } from '@angular/core';
import { FileSynchronizerService } from './file-synchronizer.service';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DATABASES } from '../models/databases';

@Injectable()
export class DataService {

  constructor(private fileSynchronizer: FileSynchronizerService) {}

  getAll(dbType: DATABASES) {
    switch (dbType) {
      case DATABASES.songs:
        return this.getSongs();
      case DATABASES.songgroups:
        return this.getSonggroups();
    }
  }

  saveType(dbType: DATABASES, data) {
    switch (dbType) {
      case DATABASES.songs:
        return this.saveSong(data);
      case DATABASES.songgroups:
        return this.saveSonggroup(data);
    }
  }

  getSongs(): Promise<any[]> {
    return this.fileSynchronizer.getSongs();
  }

  getSonggroups(): Promise<any[]> {
    return this.fileSynchronizer.getSonggroups();
  }

  getSong(songid: string): Promise<any> {
    return this.fileSynchronizer.getSong(songid);
  }

  saveSong(song: Song) {
    this.fileSynchronizer.saveSong(song);
  }

  deleteSong(songid: string) {
    this.fileSynchronizer.deleteSong(songid);
  }

  getSonggroup(songgroupid: string): Promise<any> {
    return this.fileSynchronizer.getSonggroup(songgroupid);
  }

  saveSonggroup(songgroup: Songgroup) {
    return this.fileSynchronizer.saveSonggroup(songgroup);
  }

  deleteSonggroup(songgroupid: string) {
    return this.fileSynchronizer.deleteSonggroup(songgroupid);
  }

}
