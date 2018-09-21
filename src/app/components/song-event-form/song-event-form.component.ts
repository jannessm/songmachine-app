import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { DataService } from '../../services/data.service';

import { Song } from '../../models/song';
import { DATABASES } from '../../models/databases';
import { Songgroup } from '../../models/songgroup';

@Component({
  selector: 'app-song-event-form',
  templateUrl: './song-event-form.component.html',
  styleUrls: ['./song-event-form.component.scss']
})
export class SongEventFormComponent implements OnInit {

  songsForm: FormGroup;
  songsArray: FormArray = new FormArray([]);
  type: DATABASES;
  id: string;
  songscounter: number[] = [1];  
  songs: Song[] = [];
  
  song: Song = new Song();
  songBooksStr: string = '';

  songgroup: Songgroup = new Songgroup();
  songUUID: string;

  constructor(
    private dataService: DataService,
    private dialogRef: MatDialogRef<SongEventFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {
    if(!this.data.object.songs)
      this.type = DATABASES.songs;
    else{
      this.type = DATABASES.events;
      this.songsForm = new FormGroup({
        songsArray: this.songsArray
      });
    }
    this.initValues();
  }

  onNoClick():void{
    switch(this.type){
      case DATABASES.songs:
        this.dialogRef.close();
        break;
      case DATABASES.events:
        this.dialogRef.close();
        break;
    }
  }

  onSave():void{
    switch(this.type){
      case DATABASES.songs:
        this.song.books = this.songBooksStr
          .split(';')
          .map(Function.prototype.call, String.prototype.trim)
          .filter((val) => {
            return /\w/g.test(val);
          });
        console.log(this.song);
        this.dialogRef.close(this.song);
        break;
      case DATABASES.events:
        this.songgroup.songs = [];
        for(let control of this.songsArray.controls){
          if(control.value.songSelect){
            this.songgroup.songs.push(control.value.songSelect.id);
          }
        }
        this.dialogRef.close(this.songgroup);
        break;
    }
  }

  getControls(){
    return (<FormArray>this.songsForm.get('songsArray')).controls;
  }

  addSongField(value?:Song){
    (<FormArray>this.songsForm.get('songsArray')).push(
      new FormGroup({
        songSelect: new FormControl(value)
      })
    );
    console.log(this.songs);
  }

  removeSongField(){
    this.songsArray.removeAt(this.songsArray.length - 1);
  }

  showSong(song?: Song){
    return song ? song.title : undefined;
  }

  initValues(){
    this.dataService.getAll(DATABASES.songs).then( songs => {
      this.songs = songs;
      
      // init song/event if editMeta is called
      switch(this.type){
        case DATABASES.songs:
          this.song = new Song(this.data.object);
          this.songBooksStr = this.song.books ? this.song.books.join('; ') : '';
          break;
          
        case DATABASES.events:
          this.songgroup = new Songgroup(this.data.object);
          for (let song of this.songgroup.songs){
            this.addSongField(
              this.songs.find((val, id, obj) => {
                return val.id === song;
              })
            );
          }
          break;
      }
    })

  }
}
