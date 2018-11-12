import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Song } from '../../models/song';
import { ScrollApiService } from '../../services/scroll-api.service';
import { MatDialog } from '@angular/material';
import { QRDialogComponent } from '../../components/qr-dialog/qr-dialog.component';
import { ApiService } from '../../services/connectivity/api.service';
import { ParserService } from '../../services/parser.service';

@Component({
  selector: 'app-performview',
  templateUrl: './performview.component.html',
  styleUrls: ['./performview.component.scss']
})
export class PerformviewComponent implements OnInit {

  songs: Song[] = [];
  activeSong = 0;
  songId = '';

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private scrollApiService: ScrollApiService,
    private dialog: MatDialog,
    private apiService: ApiService,
    private parserService: ParserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
      if (/_/g.test(songId)) {
        const proms = [];
        songId.split('_').forEach(element => {
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

  private loadSong(id) {
    if (id) {
      return this.dataService
        .getSong(id)
        .then(result => {
          this.songs.push(<Song>result);
      });
    }
    return new Promise(res => res());
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
    this.apiService.generateRunHttpServerRequest(htmls).then(data => {
      this.dialog.open(QRDialogComponent, {
        height: '400px',
        width: '300px',
        data
      });
    });
  }

}
