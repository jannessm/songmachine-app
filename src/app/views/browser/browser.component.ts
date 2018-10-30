import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { SongSonggroupFormComponent } from '../../components/song-songgroup-form/song-songgroup-form.component';
import { DexieService } from '../../services/dexie.service';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit, OnDestroy {

  type: DATABASES;
  headline: string;
  search_text: string;
  searchControl = new FormControl('');
  searchSubscription: Subscription;

  songView: object = {
    headline: 'Your Songs',
    search_text: 'Search a song'
  };
  songgroupView: object = {
    headline: 'Your Events',
    search_text: 'Search an event'
  };
  songs: Song[] = [];
  songgroups: Songgroup[] = [];

  filteredElems: Song[] | Songgroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dexieService: DexieService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
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
              value.artist.toLowerCase().indexOf(search) > -1 ||
              value.title.toLowerCase().indexOf(search) > -1 ||
              value.bpm.toString().indexOf(search) > -1 ||
              value.books
                .map(val => val.toLowerCase().indexOf(search) > -1)
                .reduce((res, val) => res || val, false)
            ).reduce((res, val) => res && val, true);
        }
        );
      }
    });
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  showAddForm(data) {
    if (!data) {
      data = this.type === DATABASES.songs ? new Song() : new Songgroup();
    }
    const dialogRef = this.dialog.open(SongSonggroupFormComponent, {
      width: '500px',
      data: {object: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.saveType(this.type, result);
      }
    });
  }

  updateElems() {
    const arr = [];
    setTimeout(() => {
      this.dataService.getAll(<DATABASES>this.type).then( res => {
        for (const e of res) {
          if (this.type === DATABASES.songs) {
            arr.push(new Song(e));
          } else {
            arr.push(new Songgroup(e));
          }
        }

        if (this.type === DATABASES.songs) {
          this.songs = arr;
          this.filteredElems = this.songs;
        } else {
          this.songgroups = arr;
          this.filteredElems = this.songgroups;
        }
      });
    }, 10);
  }

}
