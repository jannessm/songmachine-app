import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-songgroup',
  templateUrl: './songgroup.component.html',
  styleUrls: ['./songgroup.component.scss']
})
export class SonggroupComponent implements OnInit {

  @Input() songgroup: Songgroup;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();
  JSON = JSON;

  constructor(private dataService: DataService, private router: Router, private exportService: ExportService) { }

  songs: string[] = [];

  ngOnInit() {
    if (!this.songgroup.songs) {
      this.songgroup = new Songgroup();
    }
    this.setSongs();
  }

  emitEditMeta(songgroup: Songgroup) {
    this.editMeta.emit(songgroup);
  }

  delete(songgroup: Songgroup) {
    this.dataService.deleteSonggroup(songgroup.id);
  }

  setSongs() {
    this.songgroup.songs.forEach( uuid => {
      this.dataService.getSong(uuid).then(res => {
        if (res) {
          this.songs.push(res.title);
        }
      });
    });
  }

  performSonggroup() {
    this.router.navigateByUrl('perform/' + this.songgroup.songs.join('_'));
  }

  exportSt() {
    this.exportService.getStFile(this.songgroup).then(() => console.log('yeah'));
  }
}
