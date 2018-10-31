import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Block } from '../models/block';
import { Line } from '../models/line';
import { HtmlFactoryService } from './html-factory.service';

@Injectable()
export class ParserService {

  private regexs = {
    newline: /\r?\n/,
    header: new RegExp('\\[(?:\\s*?(title|bpm|artist|books)\\s*:\\s*([\\w\\s-_,]*)\\s*;)?' +
                         '(?:\\s*?(title|bpm|artist|books)\\s*:\\s*([\\w\\s-_,]*)\\s*;)?' +
                         '(?:\\s*?(title|bpm|artist|books)\\s*:\\s*([\\w\\s-_,]*)\\s*;)?' +
                         '(?:\\s*?(title|bpm|artist|books)\\s*:\\s*([\\w\\s-_,]*)\\s*;?)?\\s*\\]', 'gi'),
    block: /\[(?:Block\s*:\s*)([\w\s-_]*)\]/gi,
    order: /\[(?:order\s*:\s*)([\w\s-_,]*)\]/gi,
    chord: /(?:\[\s*)([\w<>\*\#]*)(?:\s*\])/gi,
    invChord: /([\w\#]+)/gi
  };

  constructor(private htmlFactory: HtmlFactoryService) { }

  public songToPDF( song: Song ) {
    const html = this.songToHTML(song);
  }

  public songToHTML( song: Song): string {
    return this.htmlFactory.songToHTML(song);
  }

  public songToString( song: Song ): string {
    if (!song) {
      return '';
    } else {
      song = new Song(song);
    }
    let str = this.metaToString(song);

    // blocks
    for (const block of song.blocks) {
      str += this.blockToString(block) + '\n';
    }

    return str;
  }

  public stringToSong( str: string ): Song {
    const newSong = new Song();
    // get meta
    const meta = this.getMeta(str);
    for (const m in meta) {
      if (meta[m]) {
        newSong[m] = meta[m];
      }
    }

    // get blocks
    newSong.blocks = this.getAllBlocks(str);
    for (const b of newSong.blocks) {
      newSong.annotationCells = this.max(b.annotationCells, newSong.annotationCells);
      newSong.maxLineWidth = this.max(b.maxLineWidth, newSong.maxLineWidth);
    }

    return newSong;
  }

  private getMeta(str: string): object {
    this.resetRegex();
    const meta = {};

    const order = this.regexs.order.exec(str);
    if (order) {
      meta['order'] = order[1].split(',').map(value => value.trim());
    }

    const matches = this.regexs.header.exec(str);
    if (matches && matches.length > 2) {

      for (let i = 1; i < matches.length; i += 2) {
        if (matches[i] && matches[i] !== 'books') {
          meta[matches[i]] = matches[i + 1];
        } else if (matches[i]) {
          meta[matches[i]] = matches[i + 1].split(',').map(value => value.trim());
             }
      }
    }
    return meta;
  }

  private getAllBlocks(str: string): Block[] {
    this.resetRegex();
    const blocks: Block[] = [];
    const blockStarts: number[] = [];
    const titles: string[] = [];
    let m;
    do {
      m = this.regexs.block.exec(str);
      if (m) {
        blockStarts.push(m.index);
        titles.push(m[1]);
      }
    } while (m);

    for (let i = 0; i < blockStarts.length; i++) {
      let block;
      if (i + 1 === blockStarts.length) {
        block = str.substr(blockStarts[i]);
      } else {
        block = str.substr(blockStarts[i], blockStarts[i + 1] - blockStarts[i]);
      }
      blocks.push(this.getBlock(titles[i], block));
    }
    return blocks;
  }

  private getBlock(title: string, str: string): Block {
    const newBlock = new Block();
    newBlock.title = title;
    newBlock.lines = this.getAllLines(str);

    newBlock.lines.forEach((val, index, arr) => {
      newBlock.maxLineWidth = this.max(val.lyricsWidth, newBlock.maxLineWidth);
      newBlock.maxDiffAnnotationsPerRepition = this.max(val.differentAnnotations, newBlock.maxDiffAnnotationsPerRepition);
      newBlock.annotationCells = this.max(val.annotationCells, newBlock.annotationCells);
    });
    return newBlock;
  }

  private getAllLines(str: string): Line[] {
    this.resetRegex();
    const lines: Line[] = [];
    for (const l of str.split(this.regexs.newline)) {
      if (l.trim() === '' || this.regexs.block.test(l)) {
        continue;
      }
      const line = this.getLine(l);
      lines.push(line);
    }
    return lines;
  }

  private getLine(str: string): Line {
    this.resetRegex();
    const newLine: Line = new Line();
    newLine.lyrics.bottomLine = str;
    const matches = [];

    let m;
    do {
      m = this.regexs.chord.exec(str);
      if (m) {
        matches.push(m);
        newLine.lyrics.bottomLine = newLine.lyrics.bottomLine.replace(m[0], '');
      }
    } while (m);

    const annotationblocks = newLine.lyrics.bottomLine.split('|').map(value => value.replace(/\s*$/g, ''));
    newLine.annotationCells = annotationblocks.length - 1;
    for (const anno of annotationblocks) {
      if (anno === annotationblocks[0]) {
        continue;
      }

      const annotations = anno.split(';').map(value => value.trim());
      newLine.differentAnnotations = this.max(newLine.differentAnnotations, annotations.length);
      newLine.annotations.push(annotations);
    }

    let offset = 0;
    for (let i = 0; i < matches.length; i++) {
      let len = matches[i].index - newLine.lyrics.topLine.length - offset + 1;
      len = len > 1 ? len : 2;
      offset += matches[i][0].length;
      newLine.lyrics.topLine += Array(len).join(' ') + matches[i][1];
    }
    newLine.lyrics.bottomLine = annotationblocks[0];
    newLine.lyricsWidth = newLine.lyrics.bottomLine.length;
    return newLine;
  }

  private max(a, b) {
    if (!a) {
      return b;
    }
    if (!b) {
      return a;
    }
    return a > b ? a : b;
  }

  public metaToString(song: Song): string {
    let str = '';
    // meta
    const title = song.title && song.title !== '' ? 'title: ' + song.title + '; ' : '';
    const artist = song.artist && song.artist !== '' ? 'artist: ' + song.artist + '; ' : '';
    const bpm = song.bpm ? 'bpm: ' + song.bpm + '; ' : '';
    const books = song.books && song.books.length > 0 ? 'books: ' + song.books.join(',') + '; ' : '';

    if (title || artist || bpm || books) {
      str += '[' + title + artist + bpm + books + ']\n\n';
    }

    // order
    const order = song.order && song.order.length > 0 ? '[order: ' + song.order.join(',') + ']' : '';
    if (order) {
      str += order + '\n\n';
    }
    return str;
  }

  private blockToString(block: Block): string {
    let str = '[block: ' + block.title + ']\n';

    for (const l of block.lines) {
      str += this.joinTopAndBottomLine(l) + this.joinAnnotations(l) + '\n';
    }

    return str;
  }

  private joinTopAndBottomLine(line: Line): string {
    this.resetRegex();
    const finalLine = [];

    let m;
    let matches = [];
    do {
      m = this.regexs.invChord.exec(line.lyrics.topLine);
      if (m) {
        matches.push(m);
      }
    } while (m);

    matches = matches.reverse(); // to ensure correct position
    for (let i = 0; i <= matches.length; i++) {
      // if last part start from 0
      const start = i === matches.length ? 0 : matches[i].index;
      // if first -> until end else prev position
      const end = i === 0 ? undefined : i === matches.length ? matches[i - 1].index : matches[i - 1].index - matches[i].index;
      finalLine.push(line.lyrics.bottomLine.substr(start, end));

      if (i < matches.length) {
        finalLine.push('[' + matches[i][1] + ']');
      }
    }

    return finalLine.reverse().join('');
  }

  private joinAnnotations(line: Line): string {
    if (line.annotations
      .map(value => (value.length === 1 && !value[0]))
      .reduce((result, value) => result && value, true)
    ) {
      return '';
    }
    return ' | ' +
      line.annotations
        .map(value => value.join('; '))
        .join('| ');
  }

  private resetRegex() {
    for (const reg in this.regexs) {
      if (this.regexs[reg]) {
        this.regexs[reg].lastIndex = 0;
      }
    }
  }
}
