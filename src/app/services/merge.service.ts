import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { ParserService } from './parser.service';
import { MatDialog } from '@angular/material';
import { MergeDialogComponent } from '../dialogs/merge-dialog/merge-dialog.component';

const diff = require('diff');

@Injectable()
export class MergeService {

  constructor(
    private parserService: ParserService,
    private dialog: MatDialog
  ) {}

  mergeSong(oldSong, newSongServer, newSongLocal): Promise<Song> {

    const strOld = this.parserService.songToString(oldSong);
    const strNewServer = this.parserService.songToString(newSongServer);
    const strNewLocal = this.parserService.songToString(newSongLocal);

    const diffServer = diff.diffLines(strOld, strNewServer);
    const diffLocal = diff.diffLines(strOld, strNewLocal);

    const dialogRef = this.dialog.open(MergeDialogComponent, {
      height: '80%',
      width: '80%',
      data: {
        diffServer,
        diffLocal,
        oldString: strOld
      }
    });

    return new Promise((resolve, reject) => {
      dialogRef.afterClosed().subscribe(result => {
        if (result === '--**keepLocal**--') {
          resolve(newSongLocal);
        } else if (result === '--**keepServer**--') {
          resolve(newSongServer);
        } else {
          const newSong = this.parserService.stringToSong(result);
          newSong.id = newSongLocal.id;
          resolve(newSong);
        }
      });
    });
  }
}
