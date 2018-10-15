import { Component, OnInit } from '@angular/core';

import { DATABASES } from './models/databases';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { MenuItem } from './models/menuitem';
import { FileSynchronizerService } from './services/file-synchronizer.service';
import { ParserService } from './services/parser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menu: MenuItem[] = [
    {
      route: 'browser/songs',
      icon: 'icon-song',
      active: true
    },
    {
      route: 'browser/events',
      icon: 'icon-event',
      active: false,
    },
    {
      route: 'editor',
      icon: 'icon-editor',
      active: false
    },
    {
      route: 'settings',
      icon: 'icon-settings',
      active: false
    }
  ];

  show = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private fileSynchronizer: FileSynchronizerService,
    private parserService: ParserService
  ) { }

  ngOnInit() {
    // load data from dir or force user to set defaultDir
    this.dataService.getByKey(DATABASES.settings, 'defaultPath').then(res => {
      if (!res) {
        this.router.navigateByUrl('/settings');
      }
    });
  }

  showImport(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!this.show) {
      this.show = true;
    }
  }

  hideImport(e) {
    this.show = false;
  }

  importSong(e) {
    this.show = false;
    e.preventDefault();
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = res => {

          if (reader.error) {
            // TODO is dir
          } else {
            const song = this.parserService.str2Obj(<string>reader.result);
            this.dataService.upsert(DATABASES.songs, song);
          }
        };
      });
    }
  }
}
