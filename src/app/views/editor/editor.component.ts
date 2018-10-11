import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  songIn: Song;
  songId: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
      if (songId) {
        this.dataService
          .getByKey(DATABASES.songs, songId)
          .then(result => {
            this.songIn = <Song>result;
            this.songId = songId;
        });
      }
    });
  }

  songOut(song) {
    this.songIn = song;
  }

  save() {

  }

  performMode() {
    this.router.navigateByUrl('perform/' + this.songId);
  }

  transposeUp() {}

  transposeDown() {}
}
