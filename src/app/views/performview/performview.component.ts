import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Song } from '../../models/song';
import { ScrollApiService } from '../../services/scroll-api.service';
import { MatDialog } from '@angular/material';
import { QRDialogComponent } from '../../dialogs/qr-dialog/qr-dialog.component';
import { ParserService } from '../../services/parser.service';
import { DOCUMENT } from '@angular/common';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-performview',
  templateUrl: './performview.component.html',
  styleUrls: ['./performview.component.scss']
})
export class PerformviewComponent implements OnInit, OnDestroy {

  songs: Song[] = [];
  activeSong = 0;
  songId = '';
  title: string;
  host: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private scrollApiService: ScrollApiService,
    private dialog: MatDialog,
    private storeService: StoreService,
    private parserService: ParserService,
    @Inject(DOCUMENT) private doc: Document
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
      this.title = params['title'];
      if (/_/g.test(songId)) {
        const proms = [];
        songId.split('_').filter(val => !!val).forEach(element => {
          proms.push(this.loadSong(element));
        });
        Promise.all(proms).then(() => {
          this.songId = this.songs[0].id;
        });
      } else {
        this.loadSong(songId);
        this.songId = songId;
      }
    });
  }

  ngOnDestroy() {
    // this.apiService.generateStopHttpServerRequest();
  }

  private loadSong(id) {
    if (id) {
      return this.dataService
        .getSong(id)
        .then(result => {
          this.songs.push(<Song>result);
      });
    }
    return Promise.resolve();
  }

  protected increaseActiveSong(e) {
    if (e && e.target) { // if pressed by button remove focus
      e.target.blur();
    }
    setTimeout(() => {
      this.activeSong++;
      this.activeSong = this.activeSong % this.songs.length;
      this.songId = this.songs[this.activeSong].id;
      this.scrollApiService.changeSong(this.activeSong);
    }, 2);
  }

  protected decreaseActiveSong(e) {
    if (e && e.target) { // if pressed by button remove focus
      e.target.blur();
    }
    setTimeout(() => {
      this.activeSong--;
      this.activeSong = this.activeSong % this.songs.length;
      if (this.activeSong < 0) {
        this.activeSong += this.songs.length;
      }
      this.songId = this.songs[this.activeSong].id;
      this.scrollApiService.changeSong(this.activeSong);
    }, 2);
  }

  protected showQR(e) {
    if (e && e.target) { // if pressed by button remove focus
      e.target.blur();
    }

    // get html for each page
    const htmls = [];
    this.songs.forEach(song => {
      htmls.push(this.parserService.songToHTML(song));
    });
    // this.apiService.generateRunHttpServerRequest(
    //   htmls, this.title, this.doc.body.clientWidth, this.doc.body.clientHeight).then((data: any) => {
    //   this.scrollApiService.setHost(new URL(data.url).host);
    //   this.dialog.open(QRDialogComponent, {
    //     height: '400px',
    //     width: '300px',
    //     data
    //   });
    // });
  }

}
