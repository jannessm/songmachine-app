import { Component, OnInit } from '@angular/core';

import { DATABASES } from './models/databases';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { MenuItem } from './models/menuitem';
import { FileSynchronizerService } from './services/file-synchronizer.service';
import { ParserService } from './services/parser.service';
import { ConfigService } from './services/config.service';

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
      route: 'browser/songgroups',
      icon: 'icon-songgroup',
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
    private router: Router,
    private dataService: DataService,
    private parserService: ParserService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    // load data from dir or force user to set defaultDir
    if (!this.configService.get('defaultPath')) {
      this.router.navigateByUrl('/settings');
    }
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
            this.dataService.saveSong(song);
          }
        };
      });
    }
  }
}
