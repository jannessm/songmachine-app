import { Component, OnInit, ViewChild, ElementRef, ComponentRef } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';
import { SongsheetTextareaComponent } from '../../components/songsheet-textarea/songsheet-textarea.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

 @ViewChild(SongsheetTextareaComponent) textfield: SongsheetTextareaComponent;

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
          .getSong(songId)
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
    this.dataService.saveSong(this.songIn).then(song => {
      this.songIn = song;
    });
  }

  performMode() {
    this.router.navigateByUrl('perform/' + this.songId);
  }

  transposeUp() {}

  transposeDown() {}

  addResolveSymbol() {
    // this.textfield.addResolveSymbol();
  }
}
