import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { ParserService } from './parser.service';

const jiff = require('jiff');

@Injectable()
export class MergeService {

  constructor(private parserService: ParserService) {}

  merge(oldSong, newSongServer, newSongLocal): Song {

    console.log('diff', jiff.diffJson(oldSong, newSongServer));
    console.log('diff', jiff.diffJson(oldSong, newSongLocal));

    return new Song();
  }
}
