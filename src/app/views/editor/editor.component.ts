import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  songIn: Song;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
      if (songId) {
        this.dataService
          .getByKey(DATABASES.songs, songId)
          .then(result => {
            this.songIn = <Song>result;
        });
      }
    });
  }

  songOut(song) {
    this.songIn = song;
  }

}
