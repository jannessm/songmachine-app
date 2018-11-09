import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Block } from '../models/block';
import { Line } from '../models/line';
import { HtmlFactoryService } from './html-factory.service';

@Injectable()
export class ParserService {

  private regexs = {
    newline: /\r?\n/,
    title: /\[(?:[^;]*;\s*)*(?:title|titel)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
    bpm: /\[(?:[^;]*;\s*)*bpm\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
    artist: /\[(?:[^;]*;\s*)*(?:artist|künstler)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
    books: /\[(?:[^;]*;\s*)*(?:books|bücher)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
    block: /\[(?:block\s*:\s*)([\w\s-_\.]*)\]/gi,
    order: /\[(?:order\s*:\s*)([\w\s-_\.,]*)\]/gi,
    chord: /(?:\[\s*)([^\s]+?)(?:\s*\])/gi,
    invChord: /([^\s]+)/gi
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

    const matchTitle = this.regexs.title.exec(str);
    const matchArtist = this.regexs.artist.exec(str);
    const matchBPM = this.regexs.bpm.exec(str);
    const matchBooks = this.regexs.books.exec(str);

    meta['title'] = matchTitle ? matchTitle[1] : undefined;
    meta['artist'] = matchArtist ? matchArtist[1] : undefined;
    meta['bpm'] = matchBPM ? matchBPM[1] : undefined;
    meta['books'] = matchBooks ? matchBooks[1].split(',').map(val => val.trim()) : undefined;

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
    const matches = [];

    // process annotations
    const annotationblocks = str.split('|').map(value => value.replace(/\s*$/g, ''));
    newLine.annotationCells = annotationblocks.length - 1;
    annotationblocks.forEach(anno => {
      if (anno === annotationblocks[0]) {
        return;
      }

      const annotations = anno.split(';').map(value => value.trim());
      newLine.differentAnnotations = this.max(newLine.differentAnnotations, annotations.length);
      newLine.annotations.push(annotations);
    });
    str = annotationblocks[0];

    // process chords
    let m;
    do {
      this.resetRegex();
      m = this.regexs.chord.exec(str);
      if (m) {
        // chord start
        const start = m.index;
        // if start < topLine.length add spaces to bottomLine
        if (newLine.lyrics.topLine.length - (newLine.lyrics.bottomLine.length + start) + 1 > 0) {
          newLine.lyrics.bottomLine += Array(newLine.lyrics.topLine.length - (newLine.lyrics.bottomLine.length + start) + 1).join(' ');
        } else if (newLine.lyrics.topLine.length - (newLine.lyrics.bottomLine.length + start) < 0) {
          newLine.lyrics.topLine += Array((newLine.lyrics.bottomLine.length + start) - newLine.lyrics.topLine.length + 1).join(' ');
        }
        const stringUntilChord = str.substr(0, start);
        newLine.lyrics.topLine += m[1] + ' ';
        newLine.lyrics.bottomLine += stringUntilChord;
        str = str.replace(stringUntilChord + m[0], '');
      } else {
        newLine.lyrics.bottomLine += str;
      }
    } while (m);
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
    const books = song.books && song.books.length > 0 ? 'books: ' + song.books.filter(val => !!val).join(',') + '; ' : '';

    if (title || artist || bpm || books) {
      str += '[' + title + artist + bpm + books + ']\n\n';
    }

    // order
    const order = song.order && song.order.length > 0 ? '[order: ' + song.order.filter(val => !!val).join(', ') + ']' : '';
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
    let lastStart = 0;
    do {
      m = this.regexs.invChord.exec(line.lyrics.topLine);
      if (m) {
        // add string until chord
        finalLine.push(line.lyrics.bottomLine.substr(lastStart, m.index - lastStart).replace(/^\s+/, ' '));
        // add chord
        finalLine.push('[' + m[1] + ']');
        lastStart = m.index;
      } else {
        finalLine.push(line.lyrics.bottomLine.substr(lastStart));
      }
    } while (m);

    return finalLine.join('');
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
    Object.values(this.regexs).forEach(element => {
      element.lastIndex = 0;
    });
  }

  public getPlainLine(line: string): string {
    return line.replace(/<(r|g|b)>/g, '') // color markdown
      .replace(/\*/g, '') // bold, italic
      .replace(/\s+/g, ' ') // multiple spaces
      .replace(/\s*-\s*/g, '') // spaces in words
      .replace(/\d+(x|X)/g, '') // amount of repetitions
      .replace(/(x|X)\d+/g, '') // amount of repetitions
      .trim();
  }
}
