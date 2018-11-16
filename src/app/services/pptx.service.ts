import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Songgroup } from '../models/songgroup';
import { DataService } from './data.service';
import { ParserService } from './parser.service';
import { Block } from '../models/block';

const PptxGen = require('pptxgenjs');

@Injectable()
export class PptxService {
  constructor(private dataService: DataService, private parserService: ParserService) {}

  public getPptxForSong(song: Song) {
    const pptx = new PptxGen();
    this.initPptx(pptx);
    this.appendSlidesForSong(pptx, song);

    pptx.save(song.title);
  }

  public getPptxForSonggroup(songgroup: Songgroup) {
    const promises: Promise<void>[] = [];
    const pptx = new PptxGen();
    this.initPptx(pptx);
    songgroup.songs.forEach(songId => {
      promises.push(this.dataService.getSong(songId).then(song => {
        this.appendSlidesForSong(pptx, song);
        pptx.addNewSlide('BLANK');
      }));
    });
    Promise.all(promises).then(() => {
      pptx.save(songgroup.name);
    });
  }

  private appendSlidesForSong(pptx, song: Song) {
    const slide = pptx.addNewSlide('TITLE');
    slide.addText(song.title, {placeholder: 'title'});
    slide.addText(song.artist, {placeholder: 'subtitle'});

    if (song.order) {
      song.order.forEach(blockTitle => {
        const block = song.blocks.find(val => val.title === blockTitle);
        this.appendSlidesForBlock(pptx, block);
      });
    } else {
      song.blocks.forEach(block => {
        this.appendSlidesForBlock(pptx, block);
      });
    }
  }

  private appendSlidesForBlock(pptx, block: Block) {
    if (block) {
      let text: string[] = [];
      block.lines.forEach(line => {
        const plainText = this.parserService.getPlainLine(line.lyrics.bottomLine);
        if (plainText) {
          text.push(plainText);
        }

        if ((text.length === 4 || block.lines[block.lines.length - 1] === line) && text.length > 0) {
          const slide = pptx.addNewSlide('LYRICS');
          slide.addText(text.join('\n'), {placeholder: 'body'});
          text = [];
        }
      });
    }
  }

  private initPptx(pptx) {
    pptx.defineSlideMaster({
      title: 'BLANK',
      bkgd: '000000'
    });
    pptx.defineSlideMaster({
      title: 'TITLE',
      bkgd: '000000',
      objects: [
        {
          'placeholder': {
            options: {
              name: 'title',
              type: 'title',
              x: '10%', y: '40%',
              w: '80%', h: '25%',
              color: 'ffffff',
              align: 'center',
              valign: 'center'
            },
            text: ''
          }
        },
        {
          'placeholder': {
            options: {
              name: 'subtitle',
              type: 'body',
              x: '10%', y: '65%',
              w: '80%', h: '10%',
              color: 'AAAAAA',
              align: 'center',
              valign: 'center',
              fontSize: 24
            },
            text: ''
          }
        }
      ]
    });
    pptx.defineSlideMaster({
      title: 'LYRICS',
      bkgd: '000000',
      objects: [
        {
          'placeholder': {
            options: {
              name: 'body',
              type: 'body',
              x: '10%', y: '10%',
              w: '80%', h: '80%',
              color: 'ffffff',
              align: 'center',
              valign: 'center'
            },
            text: ''
          }
        }
      ]
    });
  }
}
