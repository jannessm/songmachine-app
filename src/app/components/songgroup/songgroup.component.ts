import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Songgroup } from '../../models/songgroup';
import { DataService } from '../../services/data.service';
import { DATABASES } from '../../models/databases';
import { Router } from '@angular/router';

@Component({
  selector: 'app-songgroup',
  templateUrl: './songgroup.component.html',
  styleUrls: ['./songgroup.component.scss']
})
export class SonggroupComponent implements OnInit {

  @Input() songgroup: Songgroup;
  @Output() editMeta: EventEmitter<any> = new EventEmitter();
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  JSON = JSON;

  constructor(private dataService: DataService, private router: Router) { }

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
    this.deleted.emit();
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
}
