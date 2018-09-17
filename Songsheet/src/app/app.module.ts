import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { BrowserComponent } from './components/browser/browser.component';
import { SettingsComponent } from './components/settings/settings.component';
import { EditorComponent } from './components/editor/editor.component';
import { NavComponent } from './components/nav/nav.component';
import { SongComponent } from './components/song/song.component';
import { EventComponent } from './components/event/event.component';
import { SongEventFormComponent } from './components/song-event-form/song-event-form.component';
import { ColorComponent } from './components/color/color.component';
import { IconsComponent } from './components/icons/icons.component';

import { DataService } from './services/data/data.service';
import { ParserService } from './services/parser/parser.service';

@NgModule({
  declarations: [
    AppComponent,
    BrowserComponent,
    SettingsComponent,
    EditorComponent,
    NavComponent,
    SongComponent,
    EventComponent,
    SongEventFormComponent,
    ColorComponent,
    IconsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    DataService,
    ParserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
