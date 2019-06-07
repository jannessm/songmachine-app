import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';

import { DataService } from '../../services/data.service';
import { TranslationService } from '../../services/translation.service';
import * as moment from 'moment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-song-songgroup-form',
  templateUrl: './song-songgroup-form.component.html',
  styleUrls: ['./song-songgroup-form.component.scss'],
})
export class SongSonggroupFormComponent implements OnInit {

  songsForm: FormGroup;
  type: DATABASES;
  id: string;
  songscounter: number[] = [1];
  songgroupSongs: Song[] = [];
  songs: Song[] = [];
  filteredSongs: Song[] = [];
  songSelect: FormControl;

  song: Song = new Song();
  songBooksStr = '';

  songgroup: Songgroup = new Songgroup();
  songgroupDate: string;
  initDate: moment.Moment;
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

        this.songgroupSongs.forEach(song => this.songgroup.songs.push(song.id));
        this.dialogRef.close(this.songgroup);
        break;
    }
  }

  addSongField(value?: Song) {
    console.log(value.title);
    this.songgroupSongs.push(value);
  }

  removeSongField() {
    // this.songsArray.removeAt(this.songsArray.length - 1);
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
        this.songSelect = new FormControl('');
        this.songSelect.valueChanges.subscribe(value => {
          this.filteredSongs = this._filter(value);
        });
        this.filteredSongs = this.songs.sort((a, b) => this._sortStrings(a.title, b.title));
        this.songgroup = new Songgroup(this.data.object);
        this.initDate = moment(this.songgroup.date);
        this.songgroupTime = this.songgroup.time;
        for (const song of this.songgroup.songs) {
          this.addSongField(
            this.songs.find(val => {
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
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.songs.filter(option => option.title.toLowerCase().includes(filterValue));
    } else {
      return this.songs;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.songgroupSongs,
      event.previousIndex,
      event.currentIndex
    );
  }
}
