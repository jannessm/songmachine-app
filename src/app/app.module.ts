import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatSidenavModule,
  MatButtonModule,
  MatInputModule,
  MatCardModule,
  MatDialogModule,
  MatMenuModule,
  MatDividerModule,
  MatTooltipModule,
  MatToolbarModule,
  MatGridListModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatSelectModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  DateAdapter,
  MAT_DATE_FORMATS
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatMomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SongComponent } from './components/song/song.component';
import { SonggroupComponent } from './components/songgroup/songgroup.component';
import { PreviewComponent } from './components/preview/preview.component';
import { BrowserComponent } from './views/browser/browser.component';
import { SettingsComponent } from './views/settings/settings.component';
import { EditorComponent } from './views/editor/editor.component';
import { PerformviewComponent } from './views/performview/performview.component';
import { AceWrapperComponent } from './components/ace-wrapper/ace-wrapper.component';

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
import { ExportService } from './services/export.service';
import { SngService } from './services/sng.service';
import { PptxService } from './services/pptx.service';
import { ScrollApiService } from './services/scroll-api.service';
import { GrammarParser } from './services/grammar-parser.service';

import { QRDialogComponent } from './dialogs/qr-dialog/qr-dialog.component';
import { AlertDialogComponent } from './dialogs/alert/alert-dialog.component';
import { MergeDialogComponent } from './dialogs/merge-dialog/merge-dialog.component';
import { SongSonggroupFormComponent } from './dialogs/song-songgroup-form/song-songgroup-form.component';
import { HelpDialogComponent } from './dialogs/help/help-dialog.component';
import { StoreService } from './services/store.service';

import { AceEditorModule } from 'ng2-ace-editor';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeIt from '@angular/common/locales/it';

export function initConfigs(configService: ConfigService) {
  return () => configService.init();
}

registerLocaleData(localeDe, 'de');
registerLocaleData(localeEn, 'en');
registerLocaleData(localeEs, 'es');
registerLocaleData(localeIt, 'it');

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    SettingsComponent,
    EditorComponent,
    SongComponent,
    SonggroupComponent,
    SongSonggroupFormComponent,
    PreviewComponent,
    PerformviewComponent,
    SafePipe,
    TranslatePipe,
    MergeDialogComponent,
    QRDialogComponent,
    AlertDialogComponent,
    HelpDialogComponent,
    AceWrapperComponent
  ],
  imports: [
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
    MatMenuModule,
    MatDividerModule,
    MatTooltipModule,
    MatToolbarModule,
    MatGridListModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    DragDropModule,
    AutosizeModule,
    HttpClientModule,
    AceEditorModule,
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
    ExportService,
    SngService,
    PptxService,
    ScrollApiService,
    StoreService,
    GrammarParser,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfigs,
      deps: [ConfigService],
      multi: true
    },
    { provide: LOCALE_ID, useValue: 'en' },
    { provide: MAT_DATE_LOCALE, useValue: 'en' },
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  entryComponents: [
    SongSonggroupFormComponent,
    MergeDialogComponent,
    QRDialogComponent,
    AlertDialogComponent,
    HelpDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
