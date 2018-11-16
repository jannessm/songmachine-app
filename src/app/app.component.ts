import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { MenuItem } from './models/menuitem';
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
      icon: 'icon-calendar',
      active: false,
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
      // this.router.navigateByUrl('/settings');
    }
  }

  showImport(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.dataTransfer.dropEffect = 'copy';
    if (!this.show) {
      this.show = true;
    }
  }

  hideImport(clickEvent) {
    this.show = false;
  }

  importSong(clickEvent) {
    this.show = false;
    clickEvent.preventDefault();
    if (clickEvent.dataTransfer.files) {
      Array.from(clickEvent.dataTransfer.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = res => {

          if (reader.error) {
            // TODO is dir
          } else {
            const song = this.parserService.stringToSong(<string>reader.result);
            this.dataService.saveSong(song);
          }
        };
      });
    }
  }
}
