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

  constructor(private route: ActivatedRoute, private dataService: DataService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
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
      });
    }
  }

}
