import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { SongSonggroupFormComponent } from '../../dialogs/song-songgroup-form/song-songgroup-form.component';
import { DexieService } from '../../services/dexie.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit, OnDestroy {

  type: DATABASES;
  headline: string;
  searchText: string;
  searchControl = new FormControl('');
  searchSubscription: Subscription;

  songView: object = {
    headline: this.translationService.i18n('browser.headline.songs'),
    searchText: this.translationService.i18n('browser.search.song')
  };
  songgroupView: object = {
    headline: this.translationService.i18n('browser.headline.songgroups'),
    searchText: this.translationService.i18n('browser.search.songgroup')
  };
  songs: Song[] = [];
  songgroups: Songgroup[] = [];
  gridCols = 3;

  filteredElems: Song[] | Songgroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private dexieService: DexieService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  @HostListener('window:resize', ['$event'])
  resizeHandler(event) {
    if (event.srcElement.document.body.clientWidth > 1199) {
      this.gridCols = 5;
    } else {
      this.gridCols = 3;
    }
  }

  ngOnInit() {
    if (this.doc.body.clientWidth > 1199) {
      this.gridCols = 5;
    }

    this.dexieService.changes.subscribe(() => {
      this.updateElems();
    });

    this.route.params.subscribe(params => {
      this.type = params['type'];
      switch (this.type) {
        default:
        case DATABASES.songs:
          this.type = DATABASES.songs;
          Object.assign(this, this.songView);
          break;
        case DATABASES.songgroups:
          Object.assign(this, this.songgroupView);
          break;
      }

      this.updateElems();
    });

    this.searchSubscription = this.searchControl.valueChanges.subscribe(searchInput => {
      searchInput = searchInput.toLowerCase().trim();
      if (this.type === DATABASES.songs) {
        this.filteredElems = this.songs.filter(value => {
          return searchInput
            .split(' ')
            .filter(v => !!v)
            .map(search =>
              (value.artist && value.artist.toLowerCase().indexOf(search) > -1) ||
              (value.title && value.title.toLowerCase().indexOf(search) > -1) ||
              (value.bpm && value.bpm.toString().indexOf(search) > -1) ||
              (value.books && value.books
                .map(val => val.toLowerCase().indexOf(search) > -1)
                .reduce((res, val) => res || val, false))
            ).reduce((res, val) => res && val, true);
        }
        );
      }
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  showAddForm(data?) {
    let newObject = false;
    if (!data) {
      data = this.type === DATABASES.songs ? new Song() : new Songgroup();
      newObject = true;
    }
    const dialogRef = this.dialog.open(SongSonggroupFormComponent, {
      width: '500px',
      data: {object: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.saveType(this.type, result).then(res => {
          if (res instanceof Song && newObject) {
            this.router.navigateByUrl('/editor/' + res.id);
          } else if (res) {
            this.updateElems();
          }
        });
      }
    });
  }

  updateElems() {
    if (this.type === DATABASES.songs) {
      let allDocs = this.dataService.getAll(DATABASES.songs);
      allDocs = (<Song[]>allDocs).map(e => new Song(e)).sort(this.sort);
      this.songs = allDocs;
      this.filteredElems = this.songs;
    } else {
      let allDocs = this.dataService.getAll(DATABASES.songgroups);
      allDocs = (<Songgroup[]>allDocs).map(e => new Songgroup(e)).sort(this.sort);
      this.songgroups = allDocs;
      this.filteredElems = this.songgroups;
    }
  }

  private sort(a: Song | Songgroup, b: Song | Songgroup): number {
    if (a && b && a instanceof Song && b instanceof Song && !!a.title && !!b.title) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    } else if (a && b && a instanceof Songgroup && b instanceof Songgroup && !!a.name && !!b.name) {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1;
      } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    }
    return 0;
  }

}
