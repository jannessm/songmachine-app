import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FileSynchronizerService } from '../../services/file-synchronizer.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  path = '';
  @ViewChild('pathinput') pathinput: ElementRef;

  constructor(private configService: ConfigService, private fileSynchronizer: FileSynchronizerService) { }

  ngOnInit() {
    this.path = this.configService.get('defaultPath');
  }

  setDefaultPath(path) {
    this.configService.set('defaultPath', path);
    this.fileSynchronizer.syncFilesIndexedDB();
    this.path = path;
  }

  selectDirectory() {
    this.pathinput.nativeElement.click();
  }

}
