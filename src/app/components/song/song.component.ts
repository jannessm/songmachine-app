import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Song } from '../../models/song';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';
import { Router } from '@angular/router';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent {

  @Input() song: Song;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(private dataService: DataService, private router: Router) { }

  editSong(song: Song) {
    this.router.navigateByUrl('/editor/' + song.id);
  }

  emitEditMeta(song: Song) {
    this.editMeta.emit(song);
  }

  del(song: Song) {
    this.dataService.deleteSong(song.id);
    this.delete.emit();
  }

}
