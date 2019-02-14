import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';

import { DataService } from '../../services/data.service';
import { TranslationService } from '../../services/translation.service';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { Moment } from 'moment';

@Component({
  selector: 'app-song-songgroup-form',
  templateUrl: './song-songgroup-form.component.html',
  styleUrls: ['./song-songgroup-form.component.scss'],
})
export class SongSonggroupFormComponent implements OnInit {

  songsForm: FormGroup;
  songsArray: FormArray = new FormArray([]);
  type: DATABASES;
  id: string;
  songscounter: number[] = [1];
  songs: Song[] = [];
  filteredSongs: Observable<Song[]>[] = [];

  song: Song = new Song();
  songBooksStr = '';

  songgroup: Songgroup = new Songgroup();
  songgroupDate: string;
  songgroupTime: string;
  songUUID: string;

  @ViewChild('songTitle') songTitle: ElementRef;

  constructor(
    private dataService: DataService,
    private dialogRef: MatDialogRef<SongSonggroupFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private snackbar: MatSnackBar,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    if (!this.data.object.songs) {
      this.type = DATABASES.songs;
    } else {
      this.type = DATABASES.songgroups;
      this.songsForm = new FormGroup({
        songsArray: this.songsArray
      });
    }
    this.initValues();
  }

  onNoClick(): void {
    switch (this.type) {
      case DATABASES.songs:
        this.dialogRef.close();
        break;
      case DATABASES.songgroups:
        this.dialogRef.close();
        break;
    }
  }

  onSave(): void {
    if (!this.song.title && !this.songgroup.name) {
      this.snackbar.open(this.translationService.i18n('error.add.form.title.missing'), undefined, {duration: 2000});
      this.songTitle.nativeElement.focus();
      return;
    }
    switch (this.type) {
      case DATABASES.songs:
        this.song.books = this.songBooksStr
          .split(';')
          .map(value => value.trim())
          .filter(val => /\w/g.test(val));
        this.dialogRef.close(this.song);
        break;
      case DATABASES.songgroups:
        this.songgroup.songs = [];

        if (this.songgroupDate) {
          this.songgroup.date = this.songgroupDate;
        }
        if (this.songgroupTime) {
          this.songgroup.time = this.songgroupTime;
        }

        for (const control of this.songsArray.controls) {
          if (control.value.songSelect) {
            this.songgroup.songs.push(control.value.songSelect.id);
          }
        }
        this.dialogRef.close(this.songgroup);
        break;
    }
  }

  getControls() {
    return (<FormArray>this.songsForm.get('songsArray')).controls;
  }

  addSongField(value?: Song) {
    const control = new FormControl(value);

    this.filteredSongs.push(control.valueChanges.pipe(
      startWith(''),
      map(song => this._filter(song))));

    (<FormArray>this.songsForm.get('songsArray')).push(
      new FormGroup({
        songSelect: control
      })
    );
  }

  removeSongField() {
    this.songsArray.removeAt(this.songsArray.length - 1);
  }

  showSong(song?: Song) {
    return song ? song.title : undefined;
  }

  initValues() {
    this.songs = this.dataService.getSongs();

    // init song/songgroup if editMeta is called
    switch (this.type) {
      case DATABASES.songs:
        this.song = new Song(this.data.object);
        this.songBooksStr = this.song.books ? this.song.books.join('; ') : '';
        break;

      case DATABASES.songgroups:
        this.songgroup = new Songgroup(this.data.object);
        for (const song of this.songgroup.songs) {
          this.addSongField(
            this.songs.find((val, id, obj) => {
              return val.id === song;
            })
          );
        }
        break;
    }
  }

  private _sortStrings(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  private _filter(value: string): Song[] {
    const filterValue = value.toLowerCase();
    return this.songs.filter(option => option.title.toLowerCase().includes(filterValue));
  }
}
