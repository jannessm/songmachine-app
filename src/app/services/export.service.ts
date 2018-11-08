import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DataService } from './data.service';
import { SngService } from './sng.service';

@Injectable()
export class ExportService {
  constructor(private dataService: DataService, private sngService: SngService) {}

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

  private getSngFileForSonggroup(songgroup: Songgroup): Promise<File[]> {
    const promises: Promise<File>[] = [];
    songgroup.songs.forEach(songId => {
      promises.push(this.dataService.getSong(songId).then(song => {
        return this.sngService.getSngFile(song);
      }));
    });

    Promise.all(promises).then(songs => {
      // return .zip with all sngFiles for a songgroup
      return songs;
    });
  }

  private getPptxForSong(song: Song) {

  }

  private getPptxForSonggroup(songgroup: Songgroup) {
    // return single pptx with empty slide between all songs
  }
}
