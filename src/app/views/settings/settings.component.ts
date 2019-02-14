import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { FileSynchronizerService } from '../../services/file-synchronizer.service';
import { TranslationService } from '../../services/translation.service';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DexieService } from '../../services/dexie.service';
import { DATABASES } from '../../models/databases';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  path = '';
  languages = [];
  currLang: FormControl;
  reload = 0;
  @ViewChild('pathinput') pathinput: ElementRef;

  constructor(
    private configService: ConfigService,
    private translationService: TranslationService,
    private dexieService: DexieService
  ) { }

  ngOnInit() {
    this.path = this.configService.get('defaultPath');
    this.languages = this.translationService.getLanguages();
    this.currLang = new FormControl(this.translationService.getCurrentLanguage());

    this.currLang.valueChanges.subscribe(lang => {
      this.translationService.setLanguage(lang).then(() => this.reload++);
    });
  }

  setDefaultPath(path) {
    this.configService.set('defaultPath', path);
    this.dexieService.upsert(DATABASES.settings, path);
    this.path = path;
  }

  selectDirectory() {
    this.pathinput.nativeElement.click();
  }

}
