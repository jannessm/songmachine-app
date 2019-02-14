import { Component, OnInit, ViewChild, HostListener, ElementRef } from '@angular/core';
import { Song } from '../../models/song';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
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

  @ViewChild('textfield') textfield;
  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  aceOptions = {
    wrap: true,
    fontSize: 12
  };
  songIn: Song;
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
        this.songIn = this.dataService.getSong(songId);
      }
    });
  }

  private setEditorHeight() {
    // adjust height of editor
    const editor = this.textfield;
    if (editor) {
      const maxLines = Math.floor((this.content.nativeElement.offsetHeight - 49) / Math.floor(this.aceOptions.fontSize * 1.2));
      editor.getEditor().renderer.setOption('maxLines', maxLines);
      editor.getEditor().renderer.setOption('minLines', maxLines);
    }
  }

  songOut(song) {
    this.song = song;
    this.song.id = this.songId;
  }

  save() {
    this.dataService.saveSong(this.song).then(song => {
      if (song) {
        this.songIn = song;
        this.textfield.songHasChanged = false;
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
    this.textfield.transposeUp();
  }

  transposeDown() {
    this.textfield.transposeDown();
  }

  public checkState(callback: Function) {
    if (this.textfield.songHasChanged) {
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
