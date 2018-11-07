import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { Song } from '../../models/song';

@Component({
  selector: 'app-performview',
  templateUrl: './performview.component.html',
  styleUrls: ['./performview.component.scss']
})
export class PerformviewComponent implements OnInit {

  songs: Song[] = [];
  activeSong = 0;
  songId = '';

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

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
    }, 2);
  }

}
