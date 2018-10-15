import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { ConfigService } from './config.service';
import { FILESYSTEM } from '../models/filesystem';
import { MergeService } from './merge.service';
import { Song } from '../models/song';

const path = require('path');

@Injectable()
export class FileSynchronizerService {

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private configService: ConfigService,
    private mergeService: MergeService
  ) {
    this.configService.ready.subscribe(() => {
      this.syncAllFiles();
    });
  }

  syncAllFiles() {
    this.syncFilesIndexedDB().then(files => this.syncIndexedDBFiles(files));
  }

  syncFilesIndexedDB() {
    const root = this.configService.get('defaultPath');
    return this.apiService.generateFileSystemIndex(root).then(res => {
      return new Promise((resolve, reject) => {

        const files = res.payload.map(file => file.replace(root, ''));
        files.forEach(file => {

          if (file.startsWith(DATABASES.songs)) {
            file = file.replace(DATABASES.songs + '/', '');
            this.dataService.getByKey(DATABASES.songs, file).then(song => {
              if (song) {
                // this.apiService.generateFileLoadRequest()
                const fsSong = new Song();
                this.mergeService.mergeSongs(song, fsSong);
              } else {
                console.log('no song in indexeddb with id', file);
                // TODO: this.apiService.generateFileGetRequest();
              }
            });
          } else if (file.startsWith(DATABASES.events)) {
            file = file.replace(DATABASES.events + '/', '');
            this.dataService.getByKey(DATABASES.events, file).then(songgroup => {
              if (songgroup) {
                // TODO compare timestamps
              } else {
                console.log('no event in indexeddb with id', file);
                // TODO: this.apiService.generateFileGetRequest();
              }
            });
          }
        });
        resolve(files);
      });
    });
  }

  syncIndexedDBFiles(files) {
    const root = this.configService.get('defaultPath');
    console.log('sync indexed -> files');

    this.dataService.getAll(DATABASES.songs).then(songs => {
      songs.forEach(song => {
        const filtered = files.filter(file => file.indexOf(song) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(path.join(root, FILESYSTEM.SONGS, song.id), song).then(res => {
            console.log('songs added to filesystem', res);
          });
        }
      });
    });

    this.dataService.getAll(DATABASES.events).then(songgroups => {
      songgroups.forEach(songgroup => {
        const filtered = files.filter(file => file.indexOf(songgroup) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(path.join(root, FILESYSTEM.EVENTS, songgroup.id), songgroup).then(res => {
            console.log('events added to filesystem', res);
          });
        }
      });
    });
  }
}
