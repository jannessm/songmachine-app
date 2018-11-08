import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Song } from '../../models/song';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent {

  @Input() song: Song;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService, private router: Router, private exportService: ExportService) { }

  editSong(song: Song) {
    this.router.navigateByUrl('/editor/' + song.id);
  }

  emitEditMeta(song: Song) {
    this.editMeta.emit(song);
  }

  del(song: Song) {
    this.dataService.deleteSong(song.id);
  }

  exportSt() {
    this.exportService.getStFile(this.song).then(() => {
      // snackbar, and save file by dataService
    });
  }

}
