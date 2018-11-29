import { Component } from '@angular/core';
import { DataService } from './services/data.service';
import { Router } from '@angular/router';
import { MenuItem } from './models/menuitem';
import { ParserService } from './services/parser.service';
import { EditorComponent } from './views/editor/editor.component';
import { MatDialog } from '@angular/material';
import { HelpDialogComponent } from './dialogs/help/help-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  menu: MenuItem[] = [
    {
      route: 'browser/songs',
      icon: 'icon-song',
      active: true
    },
    {
      route: 'browser/songgroups',
      icon: 'icon-songgroup',
      active: false,
    },
    {
      route: 'settings',
      icon: 'icon-settings',
      active: false
    }
  ];

  routedComponent: Component;
  show = false;

  constructor(
    private router: Router,
    private dataService: DataService,
    private parserService: ParserService,
    private dialog: MatDialog
  ) { }

  showImport(clickEvent) {
    clickEvent.preventDefault();
    clickEvent.dataTransfer.dropEffect = 'copy';
    if (!this.show) {
      this.show = true;
    }
  }

  hideImport(clickEvent) {
    this.show = false;
  }

  importSong(clickEvent) {
    this.show = false;
    clickEvent.preventDefault();
    if (clickEvent.dataTransfer.files) {
      Array.from(clickEvent.dataTransfer.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = res => {

          if (reader.error) {
            // TODO is dir
          } else {
            const song = this.parserService.stringToSong(<string>reader.result);
            this.dataService.saveSong(song);
          }
        };
      });
    }
  }

  testNavigation(event, link: string) {
    event.preventDefault();
    event.stopPropagation();
    if ( this.routedComponent && this.routedComponent instanceof EditorComponent) {
      this.routedComponent.checkState(() => this.navigate(link));
    } else {
      this.navigate(link);
    }
  }

  private navigate(link: string) {
    this.router.navigateByUrl(link);
    this.menu.forEach(item => {
      if (item.route === link) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
  }

  showHelp() {
    this.dialog.open(HelpDialogComponent, {
      width: '80%',
      height: '80%'
    });
  }
}
