import { Component, OnInit, ViewChild } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SongsheetTextareaComponent } from '../../components/songsheet-textarea/songsheet-textarea.component';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialogs/alert/alert-dialog.component';
import { TranslationService } from '../../services/translation.service';

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
    private router: Router,
    private dialog: MatDialog,
    private translationService: TranslationService
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
    this.textfield.songHasChanged = false;
    this.songIn$ = Observable.from<Song>(this.dataService.saveSong(this.song));
  }

  performMode() {
    this.checkState(() => {
      this.router.navigateByUrl('perform/' + this.songId + '/' + this.song.title);
    });
  }

  transposeUp() {
    this.textfield.transposeUp();
  }

  transposeDown() {
    this.textfield.transposeDown();
  }

  public checkState(callback: Function) {
    if (this.textfield.songHasChanged) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '300px',
        height: '200px',
        data: {
          content: this.translationService.i18n('alert.closeWithoutSaving'),
          actions: [
            this.translationService.i18n('alert.doNotSave'),
            this.translationService.i18n('alert.cancel'),
            this.translationService.i18n('alert.save')
          ]
        }
      });

      dialogRef.afterClosed().subscribe(code => {
        switch (code) {
          case 0:
            callback();
            break;
          case 2:
            this.save();
            this.songIn$.subscribe(() => {
              callback();
            });
            break;
          case 1:
          default:
            // do nothing
        }
      });
    } else {
      callback();
    }
  }
}
