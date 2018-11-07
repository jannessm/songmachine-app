import { Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SongsheetTextareaComponent } from '../../components/songsheet-textarea/songsheet-textarea.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

 @ViewChild(SongsheetTextareaComponent) textfield: SongsheetTextareaComponent;
  songIn$: Observable<Song>;
  song: Song;
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
        this.songId = songId;
        this.songIn$ = Observable.from<Song>(this.dataService.getSong(songId));
      }
    });
  }

  songOut(song) {
    this.song = song;
    this.song.id = this.songId;
  }

  save() {
    this.songIn$ = Observable.from<Song>(this.dataService.saveSong(this.song));
  }

  performMode() {
    this.router.navigateByUrl('perform/' + this.songId);
  }

  transposeUp() {
    this.textfield.transposeUp();
  }

  transposeDown() {
    this.textfield.transposeDown();
  }
}
