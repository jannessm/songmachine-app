import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { ParserService } from './parser.service';

const diff = require('diff');

@Injectable()
export class MergeService {

  constructor(private parserService: ParserService) {}

  mergeSongs(oldSong, newSong): Song {
    const oldSongString = this.parserService.obj2Str(oldSong);
    const newSongString = this.parserService.obj2Str(newSong);

    console.log(diff.diffLines(oldSongString, newSongString));

    return new Song();
  }
}
