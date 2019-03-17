import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialogs/alert/alert-dialog.component';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  @ViewChild('aceWrapper') aceWrapper;
  song: Song;
  songId: string;

  private cmdOrCtrlPressed = false;
  private sPressed = false;

  @HostListener('window:keydown', ['$event'])
  saveHotKeyDown(event) {
    if (/Mac/gi.test(navigator.platform) && event.key === 'Meta') {
      this.cmdOrCtrlPressed = true;
    } else if (!/Mac/gi.test(navigator.platform) && event.key === 'Control') {
        this.cmdOrCtrlPressed = true;
    } else if (event.key === 's') {
      this.sPressed = true;
    } else {
      this.cmdOrCtrlPressed = false;
      this.sPressed = false;
    }
  }
  @HostListener('window:keyup')
  saveHotKeyUp() {
    if (this.cmdOrCtrlPressed && this.sPressed) {
      this.save();
    } else {
      this.aceWrapper.emitSongChangeEvent();
    }
    this.cmdOrCtrlPressed = false;
    this.sPressed = false;
  }

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private router: Router,
    private dialog: MatDialog,
    private translationService: TranslationService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const songId = params['songId'];
      if (songId) {
        this.songId = songId;
        this.song = this.dataService.getSong(songId);
      }
    });
  }

  save() {
    this.dataService.saveSong(this.song).then(song => {
      if (song) {
        this.song = song;
        this.aceWrapper.songHasChanged = false;
      }
      return song;
    });
  }

  performMode() {
    this.checkState(() => {
      this.router.navigateByUrl('perform/' + this.songId + '/' + this.song.title);
    });
  }

  transposeUp() {
    this.aceWrapper.transposeUp();
  }

  transposeDown() {
    this.aceWrapper.transposeDown();
  }

  public checkState(callback: Function) {
    if (this.aceWrapper.songHasChanged) {
      const dialogRef = this.dialog.open(AlertDialogComponent, {
        width: '400px',
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
            callback();
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
