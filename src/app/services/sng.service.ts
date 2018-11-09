import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { ParserService } from './parser.service';

// https://wiki.openlp.org/Development:SongBeamer_-_Song_Data_Format
@Injectable()
export class SngService {
  constructor(private parserService: ParserService) {}

  public getSngFile(song: Song): Blob {
    let songStr = this.getSngHeader(song);

    song.blocks.forEach(block => {
      songStr += `\n---\n${block.title}`;
      block.lines.forEach(line => {
        const newLine = this.parserService.getPlainLine(line.lyrics.bottomLine);
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
