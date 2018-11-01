import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';
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
      this.songId = songId;
      if (/_/g.test(songId)) {
        songId.split('_').forEach(element => {
          this.loadSong(element);
        });
      } else {
        this.loadSong(songId);
      }
    });
  }

  private loadSong(id) {
    if (id) {
      this.dataService
        .getByKey(DATABASES.songs, id)
        .then(result => {
          this.songs.push(<Song>result);
          console.log(this.songs.length);
      });
    }
  }

  private increaseActiveSong(e) {
    e.target.blur();
    setTimeout(() => {
      this.activeSong++;
      this.activeSong = this.activeSong % this.songs.length;
    }, 2);
  }

  private decreaseActiveSong(e) {
    e.target.blur();
    setTimeout(() => {
      this.activeSong--;
      this.activeSong = this.activeSong % this.songs.length;
      if (this.activeSong < 0) {
        this.activeSong += this.songs.length;
      }
    }, 2);
  }

}
