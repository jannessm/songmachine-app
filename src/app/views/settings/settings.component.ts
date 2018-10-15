import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  path = '';
  @ViewChild('pathinput') pathinput: ElementRef;

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.path = this.configService.get('defaultPath');
  }

  setDefaultPath(path) {
    this.configService.set('defaultPath', path);
    this.path = path;
  }

  selectDirectory() {
    this.pathinput.nativeElement.click();
  }

}
