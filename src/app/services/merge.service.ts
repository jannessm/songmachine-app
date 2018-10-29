import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { ParserService } from './parser.service';

const diff = require('diff');

@Injectable()
export class MergeService {

  constructor(private parserService: ParserService) {}

  merge(oldSong, newSongServer, newSongLocal): Song {

    const strOld = this.parserService.obj2Str(oldSong);
    const strNewServer = this.parserService.obj2Str(newSongServer);
    const strNewLocal = this.parserService.obj2Str(newSongLocal);

    console.log('diff', diff.diffLines(strOld, strNewServer));
    console.log('diff', diff.diffLines(strOld, strNewLocal));

    return newSongLocal;
  }
}
