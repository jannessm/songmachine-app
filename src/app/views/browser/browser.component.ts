import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SongSonggroupFormComponent } from '../../dialogs/song-songgroup-form/song-songgroup-form.component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TranslationService } from '../../services/translation.service';
import { DOCUMENT } from '@angular/common';
import { StoreService } from '../../services/store.service';
import { SortFunctions, SortDirection, SortType, SortFunction } from '../../models/sort';
import moment = require('moment');

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

  sortFunctions = SortFunctions;
  sortDirection = SortDirection;

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
  dataSource: MatTableDataSource<Song | Songgroup>;

  sortForm: FormGroup;
  currentSortFunc: SortFunction = SortFunctions[1];
  currentSortDirection = SortDirection.DESC;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private storeService: StoreService,
    private router: Router,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private fb: FormBuilder,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  @HostListener('window:resize', ['$event'])
  resizeHandler(event) {
    if (event.srcElement.document.body.clientWidth > 999) {
      this.gridCols = 3;
    } else {
      this.gridCols = 1;
    }
  }

  ngOnInit() {
    if (this.doc.body.clientWidth > 999) {
      this.gridCols = 3;
    } else {
      this.gridCols = 1;
    }

    this.route.params.subscribe(params => {
      this.type = params['type'];
      switch (this.type) {
        default:
        case DATABASES.songs:
          this.type = DATABASES.songs;
          Object.assign(this, this.songView);
          this.storeService.songsChanged.subscribe(() => this.updateElems());
          break;
        case DATABASES.songgroups:
          Object.assign(this, this.songgroupView);
          this.storeService.songgroupsChanged.subscribe(() => this.updateElems());
          this.sortForm = this.fb.group({
            type: [this.currentSortFunc],
            direction: [this.currentSortDirection]
          });

          this.sortForm.valueChanges.subscribe(values => {
            this.currentSortFunc = values.type;
            this.currentSortDirection = values.direction;
            this.updateElems();
          });
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
          }
        });
      }
    });
  }

  updateElems() {
    if (this.type === DATABASES.songs) {
      let allDocs = this.dataService.getAll(DATABASES.songs);
      allDocs = (<Song[]>allDocs).map(e => new Song(e))
        .sort(this.sort.bind(this));
      this.songs = allDocs;
      this.filteredElems = this.songs;
    } else {
      let allDocs = this.dataService.getAll(DATABASES.songgroups);
      allDocs = (<Songgroup[]>allDocs).map(e => new Songgroup(e))
        .sort(this.sort.bind(this));
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
      if (this.currentSortFunc.name === SortType.DATE) {
        return this.currentSortFunc.func(moment(a.date), moment(b.date)) * this.currentSortDirection;
      } else {
        return this.currentSortFunc.func(a.name.toLowerCase(), b.name.toLowerCase()) * this.currentSortDirection;
      }
    }
    return 0;
  }

}
