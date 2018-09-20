import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { Song } from '../../../ts/song';
import { DATABASES, BROWSERTYPES } from '../../../ts/databases';
import { Songgroup } from '../../../ts/songgroup';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { SongEventFormComponent } from '../song-event-form/song-event-form.component';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss']
})
export class BrowserComponent implements OnInit {

  type: DATABASES;
  headline: string;
  search_text: string;
  searchInput:string = '';
  
  song_view: object = {
    headline: 'Your Songs',
    search_text: 'Search a song'
  }
  event_view: object = {
    headline: 'Your Events',
    search_text: 'Search an event'
  }
  song_elems: Song[] = [];
  songgroup_elems: Songgroup[] = [];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private dialog: MatDialog
  ) { }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.type = params['type'];
      switch(this.type){
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

  showAddForm(data){
    const dialogRef = this.dialog.open(SongEventFormComponent, {
      width: '500px',
      data: {object: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  updateElems(){
    let arr = [];
    setTimeout(() => {
      this.dataService.getAll(this.type).then( res => {
        for (let e of res) {
          if(this.type === DATABASES.songs){
            arr.push(new Song(e));
          } else {
            arr.push(new Songgroup(e));
          }
        }
        
        if(this.type === DATABASES.songs){
          this.song_elems = arr;
        } else {
          this.songgroup_elems = arr;
        }
      })
    }, 10);
  }
  
}
