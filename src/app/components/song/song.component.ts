import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Song } from '../../models/song';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../services/export.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialogs/alert/alert-dialog.component';
import { TranslationService } from '../../services/translation.service';
import { ApiService } from '../../services/connectivity/api.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent {

  @Input() song: Song;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();

  constructor(
    private dataService: DataService,
    private router: Router,
    private exportService: ExportService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private apiService: ApiService
  ) { }

  editSong(song: Song) {
    this.router.navigateByUrl('/editor/' + song.id);
  }

  emitEditMeta(song: Song) {
    this.editMeta.emit(song);
  }

  del(song: Song) {
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      width: '350px',
      height: '200px',
      data: {
        content: this.translationService.i18n('alert.sureAboutDelete'),
        actions: [
          this.translationService.i18n('alert.cancel'),
          this.translationService.i18n('alert.confirm')
        ]
      }
    });

    dialogRef.afterClosed().subscribe(code => {
      switch (code) {
        case 1:
          this.dataService.deleteSong(song.id);
          break;
        case 0:
        default:
          // do nothing
      }
    });
  }

  exportSt() {
    this.exportService.getStFile(this.song).then(
      zipData => this.apiService.generateBlobCreateRequest(zipData, this.song.title + '.st')
    ).catch(err => console.log(err));
  }

  exportSng() {
    this.exportService.getSngFile(this.song).then(
      zipData => this.apiService.generateBlobCreateRequest(zipData, this.song.title + '.sng')
    ).catch(err => console.log(err));
  }

  exportPptx() {
    this.exportService.getPptx(this.song);
  }

}
