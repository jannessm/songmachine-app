import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  path = '';
  @ViewChild('pathinput') pathinput: ElementRef;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getByKey(DATABASES.settings, 'defaultPath').then(data => {
      this.path = data.value;
    });
  }

  setDefaultPath(path) {
    this.dataService.upsert(DATABASES.settings, {id: 'defaultPath', value: path});
    this.path = path;
  }

  selectDirectory() {
    this.pathinput.nativeElement.click();
  }

}
