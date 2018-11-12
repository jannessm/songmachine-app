import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {BrowserComponent} from './views/browser/browser.component';
import {EditorComponent} from './views/editor/editor.component';
import {SettingsComponent} from './views/settings/settings.component';
import { ColorComponent } from './views/color/color.component';
import { IconsComponent } from './views/icons/icons.component';
import { PerformviewComponent } from './views/performview/performview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'browser/songs',
    pathMatch: 'full'
  },
  {
    path: 'browser/:type',
    component: BrowserComponent
  },
  {
    path: 'editor',
    component: EditorComponent
  },
  {
    path: 'editor/:songId',
    component: EditorComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'perform/:songId/:title',
    component: PerformviewComponent
  },
  {
    path: 'colors',
    component: ColorComponent
  },
  {
    path: 'icons',
    component: IconsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
