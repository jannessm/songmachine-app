import { Injectable } from '@angular/core';
import { Song } from '../models/song';
import { Block } from '../models/block';
import { Line } from '../models/line';
import { HtmlFactoryService } from './html-factory.service';
import { GrammarParser } from './grammar-parser.service';

@Injectable()
export class ParserService {

  private regexs = {
    meta: {
      title: {
        regex: /\[(?:[^;]*;\s*)*(?:title|titel)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi
      },
      bpm: {
        regex: /\[(?:[^;]*;\s*)*bpm\s*:\s*(\d*?)\s*(?:;.*\]|\])/gi,
        formatter: val => parseInt(val, 10)
      },
      ccli: {
        regex: /\[(?:[^;]*;\s*)*ccli\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi
      },
      transposedBy: {
        regex: /\[(?:[^;]*;\s*)*transpose\s*:\s*((?:\+|-)?\d*?)\s*(?:;.*\]|\])/gi,
        formatter: val => parseInt(val, 10)
      },
      artist: {
        regex: /\[(?:[^;]*;\s*)*(?:artist|künstler)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi
      },
      books: {
        regex: /\[(?:[^;]*;\s*)*(?:books|bücher)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
        formatter: val => val.split(',').map(value => value.trim())
      },
      order: {
        regex: /\[(?:[^;]*;\s*)*(?:order|reihenfolge)\s*:\s*([^;]*?)\s*(?:;.*\]|\])/gi,
        formatter: val => val.split(',').map(value => value.trim())
      }
    },
    newline: /\r?\n/,
    block: /\[(?:block\s*:\s*)([^\],;]*)\]/gi,
    chord: /(?:\[\s*)([^\s]*?)(?:\s*\])/gi,
    invChord: /([^\s]+)/gi
  };

  constructor(private htmlFactory: HtmlFactoryService, private grammarParser: GrammarParser) { }

  public songToHTML(song: Song): string {
    return this.htmlFactory.songToHTML(song);
  }

  public songToString( song: Song ): string {
    if (!song) {
      return '';
    }
    const str = this.metaToString(song);

    return song.blocks.reduce((reduced, curr) => reduced + this.blockToString(curr) + '\n', str);
  }

  public stringToSong( str: string ): Song {
    const newSong = new Song();
    // get meta
    const meta = this.getMeta(str);
    Object.keys(meta).forEach(metaKey => {
      if (meta[metaKey]) {
        newSong[metaKey] = meta[metaKey];
      }
    });

    // get blocks
    newSong.blocks = this.getAllBlocks(str);
    // set default order
    if (!newSong.order) {
      newSong.order = newSong.blocks.map(block => block.title);
    }
    newSong.blocks.forEach(b => {
      newSong.annotationCells = this.max(b.annotationCells, newSong.annotationCells);
      newSong.maxLineWidth = this.max(b.maxLineWidth, newSong.maxLineWidth);
    });

    newSong.text = str;

    return newSong;
  }

  private getMeta(str: string): object {
    this.resetRegex();
    const meta = {};

    Object.keys(this.regexs.meta).forEach(metaKey => {
      const match = this.regexs.meta[metaKey].regex.exec(str);
      if (!this.regexs.meta[metaKey].formatter) {
        this.regexs.meta[metaKey].formatter = val => val;
      }
      if (match) {
        meta[metaKey] = this.regexs.meta[metaKey].formatter(match[1]);
      }
    });

    return meta;
  }

  private getAllBlocks(str: string): Block[] {
    this.resetRegex();
    const blocks: Block[] = [];
    const blockStarts: number[] = [];
    const titles: string[] = [];
    let m;
    while ((m = this.regexs.block.exec(str)) !== null) {
      blockStarts.push(m.index);
      titles.push(m[1]);
    }

    if (blockStarts.length > 0) {
      blockStarts.forEach((start, i) => {
        let block;
        if (i + 1 === blockStarts.length) {
          block = str.substr(start);
        } else {
          block = str.substr(start, blockStarts[i + 1] - start);
        }
        blocks.push(this.getBlock(titles[i], block));
      });
    } else {
      str = str.split('\n')
        .filter(line => !/\[.*?:.*?\]/g.test(line) )
        .join('\n');
      blocks.push(this.getBlock('', str));
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

    str.split(this.regexs.newline)
      .forEach((line: string) => {
        if (line.trim() !== '' && !this.regexs.block.test(line)) {
          const l = this.getLine(line);
          lines.push(l);
        }
      });

    return lines;
  }

  private getLine(str: string): Line {
    this.resetRegex();
    const newLine: Line = new Line();

    str = this.processAnnotations(str, newLine);

    // process chords
    this.processChords(str, newLine);
    return newLine;
  }

  private processAnnotations(str: string, newLine: Line): string {
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
    return annotationblocks[0];
  }

  private processChords(str: string, newLine: Line) {
    const splitted = this.grammarParser.parseChords(str);
    splitted.forEach((val: string | {chord: string[]}) => {
      if (typeof val === 'string') {
        newLine.lyrics.bottomLine += val;
      } else if (val.chord) {
        let bottomLen = newLine.lyrics.bottomLine.length - this.countRegexChars(newLine.lyrics.bottomLine);
        const topLen = newLine.lyrics.topLine.length - this.countRegexChars(newLine.lyrics.topLine);

        if (topLen > bottomLen) {
          newLine.lyrics.bottomLine += Array(topLen - bottomLen + 1).join(' ');
          bottomLen = newLine.lyrics.bottomLine.length - this.countRegexChars(newLine.lyrics.bottomLine);
        }

        newLine.lyrics.topLine += Array(bottomLen - topLen + 1).join(' ') + val.chord + ' ';
      }
    });

    newLine.lyrics.topLine = newLine.lyrics.topLine.replace(/\s+$/g, '');
    newLine.lyrics.bottomLine = newLine.lyrics.bottomLine.replace(/\s+$/g, '');
    newLine.lyricsWidth = this.max(
      newLine.lyrics.bottomLine.replace(/<(r|g|b)>|\*/gi, '').length,
      newLine.lyrics.topLine.replace(/<(r|g|b)>|\*/gi, '').length
    );
  }

  private max(a: number, b: number) {
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
    const title = song.title && song.title !== '' ? 'title: ' + song.title : '';
    const artist = song.artist && song.artist !== '' ? 'artist: ' + song.artist : '';
    const bpm = song.bpm ? 'bpm: ' + song.bpm : '';
    const ccli = song.ccli ? 'ccli: ' + song.ccli : '';
    const books = song.books && song.books.length > 0 ? 'books: ' + song.books.filter(val => !!val).join(', ') : '';
    const transpose = song.transposedBy ? 'transpose: ' + song.transposedBy : '';

    if (title || artist || bpm || books || ccli || transpose) {
      str += '[' + [title, artist, bpm, books, ccli, transpose].filter(val => !!val).join('; ') + ']\n\n';
    }

    // order
    song.order = song.order.filter(val => !!val);
    const order = song.order && song.order.length > 0 ? '[order: ' + song.order.filter(val => !!val).join(', ') + ']' : '';
    if (order) {
      str += order + '\n\n';
    }
    return str;
  }

  private blockToString(block: Block): string {
    let str = '[block: ' + block.title + ']\n';

    block.lines.forEach((l: Line) => {
      str += this.joinTopAndBottomLine(l) + this.joinAnnotations(l) + '\n';
    });

    return str;
  }

  private joinTopAndBottomLine(line: Line): string {
    this.resetRegex();
    let finalLine = '';

    let m;
    let lastStart = 0;
    let totalRegChars = 0;
    do {
      m = this.regexs.invChord.exec(line.lyrics.topLine);
      if (m) {
        // add string until chord
        const regChars = this.countRegexChars(line.lyrics.bottomLine, m.index + totalRegChars); // 2 because largest regexp is 3

        finalLine += line.lyrics.bottomLine.substring(
          lastStart + totalRegChars,
          m.index + regChars
        ).replace(/^\s+/, ' ');
        totalRegChars = regChars;

        // add chord
        const lengthDiff =  m.index - (line.lyrics.bottomLine.length - totalRegChars);
        if (lengthDiff > 0) {
          finalLine += Array(1 + lengthDiff).join(' ');
        }
        finalLine += '[' + m[1] + ']';
        lastStart = m.index;
      } else {
        finalLine += line.lyrics.bottomLine.substr(lastStart + totalRegChars);
      }
    } while (m);

    return finalLine;
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
      if (typeof (<RegExp>element).lastIndex === 'number') {
        (<RegExp>element).lastIndex = 0;
      } else {
        Object.values(element).forEach(elem => {
          elem.regex.lastIndex = 0;
        });
      }
    });
  }

  public getPlainLine(line: string): string {
    return line.replace(/<(r|g|b)>/gi, '') // color markdown
      .replace(/\*/g, '') // bold, italic
      .replace(/\[.*?\]/g, '') // chords
      .replace(/\s+/g, ' ') // multiple spaces
      .replace(/\s*-\s*/g, '') // spaces in words
      .replace(/\d+x/gi, '') // amount of repetitions
      .replace(/x\d+/g, '') // amount of repetitions
      .trim();
  }

  private countRegexChars(string: string, end?: number): number {
    const regex = /(<(r|g|b)>|\*)/gi;
    let testString = string.substring(0, end);

    // set end
    let moveRight = 0;
    while (/(\*|<(r|g|b)>|<(r|g|b)|<)$/i.test(testString)) {
      testString += string[end + moveRight];
      moveRight++;
    }

    return testString.length - testString.replace(regex, '').length;
  }
}
