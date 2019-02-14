import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DataService } from './data.service';
import { SngService } from './sng.service';
import { ParserService } from './parser.service';
import { PptxService } from './pptx.service';

const jszip = require('jszip');

interface BlobFile {
  path: string;
  content: string | Blob;
}

@Injectable()
export class ExportService {
  constructor(
    private dataService: DataService,
    private sngService: SngService,
    private pptxService: PptxService,
    private parserService: ParserService
  ) {}

  public getStFile(obj: Song | Songgroup): Promise<Blob> {
    if (obj instanceof Song) {
      return new Promise<Blob>(res => {
        res(new Blob([this.parserService.songToString(<Song>obj)]));
      });

    } else if (obj instanceof Songgroup) {
      const songs: Promise<{path: string, content: string}>[] = [];
      obj.songs.forEach(songId => {
        const song = this.dataService.getSong(songId);
        if (song) {
          songs.push(Promise.resolve({path: song.title + '.st', content: this.parserService.songToString(song)}));
        }
      });

      return this.zip(songs);
    }
    return new Promise<Blob>(res => res());
  }

  public getSngFile(obj: Song | Songgroup): Promise<Blob> {
    if (obj instanceof Song) {
      return new Promise(res => res(new Blob([this.sngService.getSngFile(obj)]))); // .sng
    } else if (obj instanceof Songgroup) {
      const promises: Promise<{path: string, content: string}>[] = [];
      obj.songs.forEach(songId => {
        const song = this.dataService.getSong(songId);
        if (song) {
          promises.push(Promise.resolve({path: song.title + '.sng', content: this.sngService.getSngFile(song)}));
        }
      });

      return this.zip(promises);
    }
    return new Promise<Blob>(res => res());
  }

  public getPptx(obj: Song | Songgroup) {
    if (obj instanceof Song) {
      return this.pptxService.getPptxForSong(obj);
    } else if (obj instanceof Songgroup) {
      return this.pptxService.getPptxForSonggroup(obj);
    }
  }

  public getPdf(obj: Song) {
    return this.parserService.songToHTML(obj, true);
  }

  private zip(promises: Promise<BlobFile>[]): Promise<Blob> {
    return Promise.all(promises).then(results => {
      const zip = new jszip();
      results.forEach(elem => {
        zip.file(elem.path, elem.content);
      });

      return zip
        .generateInternalStream({type: 'blob'})
        .accumulate((err, content) => {
          if (err) {
            return;
          }
          return content;
        });
    });
  }
}
