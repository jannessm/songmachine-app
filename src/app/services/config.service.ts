import { Injectable, EventEmitter } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';
import { DexieService } from './dexie.service';

@Injectable()
export class ConfigService {
  private configs: any = {};

  constructor(private dexieService: DexieService) {
    this.init();
  }

  init(): Promise<any> {
    return this.dexieService.getAll(DATABASES.settings).then(data => {
      return new Promise((res, rej) => {
          data.forEach(setting => {
            this.configs[setting.id] = setting.value;
          });
          res();
        });
    });
  }

  get(key: string): any {
    return this.configs[key];
  }

  set(key: string, value: any) {
    this.configs[key] = value;
    this.dexieService.upsert(DATABASES.settings, {id: key, value: value});
  }
}
