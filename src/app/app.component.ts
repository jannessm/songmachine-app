import { Component, OnInit, OnChanges } from '@angular/core';

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
      active: true
    },
    {
      route: 'browser/events',
      icon: 'icon-event',
      active: false,
    },
    {
      route: 'settings',
      icon: 'icon-settings',
      active: false
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
