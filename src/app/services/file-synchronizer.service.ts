import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';
import { ConfigService } from './config.service';
import { FILESYSTEM } from '../models/filesystem';
import { MergeService } from './merge.service';

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

  private syncAllFiles() {
    this.syncFilesIndexedDB().then(files => this.syncIndexedDBFiles(files));
  }

  private syncFilesIndexedDB(): Promise<any> {
    const root = this.configService.get('defaultPath');
    return this.apiService.generateFileSystemIndex(root).then(res => {
      return new Promise((resolve, reject) => {

        const dataPath = path.join(root, FILESYSTEM.DATA, '/');

        res.payload.forEach(filePath => {
          const file = filePath.replace(dataPath, '');
          if (file.startsWith(DATABASES.songs)) {
            this.syncOneFileIndexedDB(DATABASES.songs, filePath);
          } else if (file.startsWith(DATABASES.events)) {
            this.syncOneFileIndexedDB(DATABASES.events, filePath);
          }
        });
        resolve(res.payload);
      });
    });
  }

  private syncIndexedDBFiles(files: string[]) {
    const root = this.configService.get('defaultPath');
    const dataPath = path.join(root, FILESYSTEM.DATA, '/');
    files = files.map(file => file.replace(dataPath, ''));

    this.dataService.getAll(DATABASES.songs).then(songs => {
      songs.forEach(song => {
        const filtered = files.filter(file => file.indexOf(song.id) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(
            path.join(root, FILESYSTEM.SONGS, song.id + '.song'), song
          ).then(res => {
            console.log('songs added to filesystem', res);
          });
        }
      });
    });

    this.dataService.getAll(DATABASES.events).then(songgroups => {
      songgroups.forEach(songgroup => {
        const filtered = files.filter(file => file.indexOf(songgroup.id) > -1);
        if (filtered.length === 0) {
          this.apiService.generateFileCreateRequest(
            path.join(root, FILESYSTEM.EVENTS, songgroup.id + '.songgroup'), songgroup
          ).then(res => {
            console.log('events added to filesystem', res);
          });
        }
      });
    });
  }

  private syncOneFileIndexedDB(dbType: DATABASES, filePath: string) {
    const root = this.configService.get('defaultPath');
    const dataPath = path.join(root, FILESYSTEM.DATA, dbType, '/');
    const file = filePath.replace(dataPath, '').replace('.songgroup', '').replace('.song', '');

    this.dataService.getByKey(dbType, file).then(object => {
      this.apiService.generateFileLoadRequest(filePath).then(response => {
        if (object) {
          this.mergeService.mergeSongs(object, response.payload);
        } else {
          this.dataService.upsert(DATABASES.songs, {id: file, value: response.payload.data});
        }
      });
    });
  }
}
