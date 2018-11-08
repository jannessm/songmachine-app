import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DataService } from './data.service';
import { SngService } from './sng.service';
import { ParserService } from './parser.service';

const jszip = require('jszip');

interface BlobFile {
  path: string;
  content: string | Blob;
}

@Injectable()
export class ExportService {
  constructor(private dataService: DataService, private sngService: SngService, private parserService: ParserService) {}

  public getStFile(obj: Song | Songgroup): Promise<Blob> {
    if (obj instanceof Song) {
      return new Promise(res => {
        res(new Blob([]));
      });

    } else if (obj instanceof Songgroup) {
      const promises: Promise<{path: string, content: string}>[] = [];
      obj.songs.forEach(songId => {
        promises.push(this.dataService.getSong(songId).then(song => {
          return {path: song.title + '.st', content: this.parserService.songToString(song)};
        }));
      });

      return this.zip(promises);
    }
    return new Promise<Blob>(res => res(new Blob()));
  }

  public getSngFile(obj: Song | Songgroup) {
    if (obj instanceof Song) {
      return this.sngService.getSngFile(obj); // .sng
    } else if (obj instanceof Songgroup) {
      return this.getSngFileForSonggroup(obj); // .zip
    }
  }

  public getPptx(obj: Song | Songgroup) {
    if (obj instanceof Song) {
      return this.getPptxForSong(obj);
    } else if (obj instanceof Songgroup) {
      return this.getPptxForSonggroup(obj);
    }
  }

  private getSngFileForSonggroup(songgroup: Songgroup): Promise<Blob> {
    const promises: Promise<Blob>[] = [];
    songgroup.songs.forEach(songId => {
      promises.push(this.dataService.getSong(songId).then(song => {
        return this.sngService.getSngFile(song);
      }));
    });

    Promise.all(promises).then(songs => {
      // return .zip with all sngFiles for a songgroup
      return songs;
    });
    return new Promise(res => res(new Blob()));
  }

  private getPptxForSong(song: Song) {

  }

  private getPptxForSonggroup(songgroup: Songgroup) {
    // return single pptx with empty slide between all songs
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
          if (err) {}
          return content;
        });
    });
  }
}
