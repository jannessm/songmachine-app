import { Injectable } from '@angular/core';
import { Song } from '../models/song';

// https://wiki.openlp.org/Development:SongBeamer_-_Song_Data_Format
@Injectable()
export class SngService {
  constructor() {}

  public getSngFile(song: Song): Blob {
    let songStr = this.getSngHeader(song);

    song.blocks.forEach(block => {
      songStr += `\n---\n${block.title}`;
      block.lines.forEach(line => {
        const newLine = line.lyrics.bottomLine
        .replace(/<(r|g|b)>/g, '') // color markdown
        .replace(/\*/g, '') // bold, italic
        .replace(/\s+/g, ' ') // multiple spaces
        .replace(/\s*-\s*/g, '') // spaces in words
        .replace(/\d+x/g, '') // amount of repetitions
        .trim();
        if (newLine) {
          songStr += '\n' + newLine;
        }
      });
    });
    return new Blob([songStr]);
  }

  private getSngHeader(song: Song): string {
    return `#Title=${song.title || ''}
#Author=${song.artist || ''}
#Editor=Songmachine 0.0.0
#VerseOrder=${song.order.join(',') || ''}
#LangCount=1
#Tempo=${song.bpm || ''}
#Version=3`;
  }
}
