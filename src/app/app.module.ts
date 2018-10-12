import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatButtonModule, MatInputModule, MatCardModule, MatDialogModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AutosizeModule } from 'ngx-autosize';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SongComponent } from './components/song/song.component';
import { EventComponent } from './components/event/event.component';
import { SongEventFormComponent } from './components/song-event-form/song-event-form.component';
import { PreviewComponent } from './components/preview/preview.component';
import { SongsheetTextareaComponent } from './components/songsheet-textarea/songsheet-textarea.component';

import { BrowserComponent } from './views/browser/browser.component';
import { SettingsComponent } from './views/settings/settings.component';
import { EditorComponent } from './views/editor/editor.component';
import { IconsComponent } from './views/icons/icons.component';
import { ColorComponent } from './views/color/color.component';

import { DataService } from './services/data.service';
import { ParserService } from './services/parser.service';
import { HtmlFactoryService } from './services/html-factory.service';

import { SafePipe } from './pipes/safe.pipe';
import { ConnectivityModule } from './connectivity/connectivity.module';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    SettingsComponent,
    EditorComponent,
    SongComponent,
    EventComponent,
    ColorComponent,
    SongEventFormComponent,
    IconsComponent,
    SafePipe,
    PreviewComponent,
    SongsheetTextareaComponent
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
    AutosizeModule
  ],
  providers: [
    DataService,
    ParserService,
    HtmlFactoryService
  ],
  entryComponents: [
    SongEventFormComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
