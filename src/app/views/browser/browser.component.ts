import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { SongEventFormComponent } from '../../components/song-event-form/song-event-form.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {

  type: DATABASES;
  headline: string;
  search_text: string;
  searchInput = '';

  song_view: object = {
    headline: 'Your Songs',
    search_text: 'Search a song'
  };
  event_view: object = {
    headline: 'Your Events',
    search_text: 'Search an event'
  };
  song_elems: Song[] = [];
  songgroup_elems: Songgroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      switch (this.type) {
        default:
        case DATABASES.songs:
          this.type = DATABASES.songs;
          Object.assign(this, this.song_view);
          break;
        case DATABASES.events:
          Object.assign(this, this.event_view);
          break;
      }

      this.updateElems();
    });
  }

  showAddForm(data) {
    if (!data) {
      data = this.type === DATABASES.songs ? new Song() : new Songgroup();
    }
    const dialogRef = this.dialog.open(SongEventFormComponent, {
      width: '500px',
      data: {object: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.upsert(this.type, result).then(() => {
          if (result instanceof Song) {
            this.router.navigateByUrl('/editor/' + result.id);
          } else {
            this.updateElems();
          }
        });
      }
    });
  }

  updateElems() {
    const arr = [];
    setTimeout(() => {
      this.dataService.getAll(this.type).then( res => {
        for (const e of res) {
          if (this.type === DATABASES.songs) {
            arr.push(new Song(e));
          } else {
            arr.push(new Songgroup(e));
          }
        }

        if (this.type === DATABASES.songs) {
          this.song_elems = arr;
        } else {
          this.songgroup_elems = arr;
        }
      });
    }, 10);
  }

}
