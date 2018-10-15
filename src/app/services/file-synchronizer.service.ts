import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { ConfigService } from './config.service';

const path = require('path');

@Injectable()
export class FileSynchronizerService {

  constructor(private dataService: DataService, private apiService: ApiService, private configService: ConfigService) {
    this.configService.ready.subscribe(() => {
      this.syncAllFiles();
    });
  }

  getAllObjects() {
    return Promise.all([this.dataService.getAll(DATABASES.events), this.dataService.getAll(DATABASES.songs)]);
  }

  syncAllFiles() {
    this.syncFilesIndexedDB(this.syncIndexedDBFiles);
  }

  syncFilesIndexedDB(callback) {
    const root = this.configService.get('defaultPath');
    this.apiService.generateFileSystemIndex(root).then(res => {
      console.log(res);
      const files = res.payload.map(file => file.replace(root, ''));
      files.forEach(file => {
        if (file.startsWith(DATABASES.songs)) {
          file = file.replace(DATABASES.songs + '/', '');
          this.dataService.getByKey(DATABASES.songs, file).then(song => {
            if (song) {
              // TODO compare timestamps
            } else {
              // TODO: this.apiService.generateFileGetRequest();
            }
          });
        }
      });
      callback(files);
    });
  }

  syncIndexedDBFiles(files) {
    const root = this.configService.get('defaultPath');
    this.dataService.getAll(DATABASES.songs).then(songs => {
      songs.forEach(song => {
        const filtered = files.filter(file => file.indexOf(song) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(path.join(root, '/songs/', song.id), song).then(res => {
            console.log(res);
          });
        }
      });
    });
  }
}
