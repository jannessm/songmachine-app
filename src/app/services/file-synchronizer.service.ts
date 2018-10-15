import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { ApiService } from './connectivity/api.service';

@Injectable()
export class FileSynchronizerService {

  constructor(private dataService: DataService, private apiService: ApiService) {
    // this.apiService.generateFileSystemIndex()
    console.log('init loading of files');
    this.getAllObjects().then(objects => {
      objects.forEach(array => {
        array.forEach(elem => {
          this.apiService.generateFileSystemIndex(elem).then(res => {
            console.log(res);
          });
        });
      });
    });
  }

  getAllObjects() {
    return Promise.all([this.dataService.getAll(DATABASES.events), this.dataService.getAll(DATABASES.songs)]);
  }
}
