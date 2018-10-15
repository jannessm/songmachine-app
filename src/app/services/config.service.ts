import { Injectable, EventEmitter } from '@angular/core';
import { DataService } from './data.service';
import { DATABASES } from '../models/databases';

@Injectable()
export class ConfigService {
  private configs: any = {};
  public ready = new EventEmitter<void>();

  constructor(private dataService: DataService) {
    this.dataService.getAll(DATABASES.settings).then(data => {
      data.forEach(setting => {
        this.configs[setting.id] = setting.value;
      });
      this.ready.emit();
    });
  }

  get(key: string): any {
    return this.configs[key];
  }

  set(key: string, value: any) {
    this.configs[key] = value;
    this.dataService.upsert(DATABASES.settings, {id: key, value: value});
  }
}
