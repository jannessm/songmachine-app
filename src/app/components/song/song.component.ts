import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';

import { Song } from '../../models/song';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../services/export.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialogs/alert/alert-dialog.component';
import { TranslationService } from '../../services/translation.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements AfterViewChecked {

  @Input() song: Song;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();

  @ViewChild('title', {read: ElementRef})title: ElementRef;
  tooltip = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private exportService: ExportService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private storeService: StoreService
  ) { }

  ngAfterViewChecked() {
    if (this.title.nativeElement.offsetWidth < this.title.nativeElement.scrollWidth) {
      this.tooltip = true;
    } else {
      this.tooltip = false;
    }
  }

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
      zipData => this.storeService.generateBlobCreateRequest(zipData, this.song.title + '.st')
    ).catch(err => console.log(err));
  }

  exportSng() {
    this.exportService.getSngFile(this.song).then(
      zipData => this.storeService.generateBlobCreateRequest(zipData, this.song.title + '.sng')
    ).catch(err => console.log(err));
  }

  exportPptx() {
    this.exportService.getPptx(this.song);
  }
}
