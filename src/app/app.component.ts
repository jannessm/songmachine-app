import { Component, OnInit } from '@angular/core';

import { DATABASES } from './models/databases';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { MenuItem } from './models/menuitem';

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
    },
    {
      route: 'browser/events',
      icon: 'icon-songgroup',
    },
    {
      route: 'editor',
      icon: 'icon-editor'
    },
    {
      route: 'settings',
      icon: 'icon-settings'
    }
  ];

  constructor(private dataService: DataService, private router: Router) { }

  ngOnInit() {
    // load data from dir or force user to set defaultDir
    this.dataService.getByKey(DATABASES.settings, 'defaultPath').then(res => {
      if (!res) {
        // this.router.navigateByUrl('/settings')
      }
    });
  }
}
