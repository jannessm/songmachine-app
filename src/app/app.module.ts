import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatButtonModule, MatInputModule, MatCardModule, MatDialogModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';

import { ConnectivityModule } from './services/connectivity/connectivity.module';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SongComponent } from './components/song/song.component';
import { SonggroupComponent } from './components/songgroup/songgroup.component';
import { SongSonggroupFormComponent } from './components/song-songgroup-form/song-songgroup-form.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SongsheetTextareaComponent } from './components/songsheet-textarea/songsheet-textarea.component';
import { BrowserComponent } from './views/browser/browser.component';
import { SettingsComponent } from './views/settings/settings.component';
import { EditorComponent } from './views/editor/editor.component';
import { PerformviewComponent } from './views/performview/performview.component';
import { IconsComponent } from './views/icons/icons.component';
import { ColorComponent } from './views/color/color.component';
import { MergeDialogComponent } from './components/merge-dialog/merge-dialog.component';

import { DataService } from './services/data.service';
import { ParserService } from './services/parser.service';
import { HtmlFactoryService } from './services/html-factory.service';
import { FileSynchronizerService } from './services/file-synchronizer.service';
import { ConfigService } from './services/config.service';
import { MergeService } from './services/merge.service';
import { DexieService } from './services/dexie.service';
import { TranslationService } from './services/translation.service';
import { KeyFinderService } from './services/keyFinder.service';

import { SafePipe } from './pipes/safe.pipe';
import { TranslatePipe } from './pipes/translate.pipe';


export function initConfigs(configService: ConfigService) {
  return () => configService.init();
}

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    SettingsComponent,
    EditorComponent,
    SongComponent,
    SonggroupComponent,
    ColorComponent,
    SongSonggroupFormComponent,
    IconsComponent,
    PreviewComponent,
    SongsheetTextareaComponent,
    PerformviewComponent,
    SafePipe,
    TranslatePipe,
    MergeDialogComponent
  ],
  imports: [
    ConnectivityModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AutosizeModule,
    HttpClientModule
  ],
  providers: [
    DataService,
    ParserService,
    HtmlFactoryService,
    FileSynchronizerService,
    ConfigService,
    MergeService,
    DexieService,
    TranslationService,
    KeyFinderService,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfigs,
      deps: [ConfigService],
      multi: true
    }
  ],
  entryComponents: [
    SongSonggroupFormComponent,
    MergeDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
