import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../services/export.service';
import { MatDialog } from '@angular/material';
import { AlertDialogComponent } from '../../dialogs/alert/alert-dialog.component';
import { TranslationService } from '../../services/translation.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-songgroup',
  templateUrl: './songgroup.component.html',
  styleUrls: ['./../song/song.component.scss', './songgroup.component.scss']
})
export class SonggroupComponent implements OnInit {

  @Input() songgroup: Songgroup;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();
  JSON = JSON;

  constructor(
    private dataService: DataService,
    private router: Router,
    private exportService: ExportService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private storeService: StoreService
  ) { }

  songs: string[] = [];
  locale: string;

  ngOnInit() {
    this.locale = this.translationService.getCurrentLanguage();
    if (!this.songgroup.songs) {
      this.songgroup = new Songgroup();
    }
    this.setSongs();
  }

  emitEditMeta(songgroup: Songgroup) {
    this.editMeta.emit(songgroup);
  }

  delete(songgroup: Songgroup) {
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
          this.dataService.deleteSonggroup(songgroup.id);
          break;
        case 0:
        default:
          // do nothing
      }
    });
  }

  setSongs() {
    this.songgroup.songs.forEach( uuid => {
      const song = this.dataService.getSong(uuid);
      if (song) {
        this.songs.push(song.title);
      }
    });
  }

  performSonggroup() {
    this.router.navigateByUrl('perform/' + this.songgroup.songs.join('_') + '/' + this.songgroup.name);
  }

  exportSt() {
    this.exportService.getStFile(this.songgroup).then(
      zipData => this.storeService.generateBlobCreateRequest(zipData, this.songgroup.name + '-st.zip')
    ).catch(err => console.log(err));
  }

  exportSng() {
    this.exportService.getSngFile(this.songgroup).then(
      zipData => this.storeService.generateBlobCreateRequest(zipData, this.songgroup.name + '-sng.zip')
    ).catch(err => console.log(err));
  }

  exportPptx() {
    this.exportService.getPptx(this.songgroup);
  }
}
