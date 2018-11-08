import { Injectable } from '@angular/core';
import { Song } from '../models/song';

// https://wiki.openlp.org/Development:SongBeamer_-_Song_Data_Format
@Injectable()
export class SngService {
  constructor() {}

  public getSngFile(song: Song): Blob {
    return new Blob();
  }

  private getSngHeader(song: Song): string {
    return '';
  }

  private getSngForBlock(song: Song): string {
    return '';
  }
}
