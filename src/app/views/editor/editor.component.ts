import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  songIn: Song = new Song();

  constructor(){}

  ngOnInit(){}

  songOut(song){
    this.songIn = song;
  }

}
