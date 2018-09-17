import { Injectable } from '@angular/core';
import { Song } from '../../models/song';
import { Block } from '../../models/block';
import { Line } from '../../models/line';

@Injectable()
export class ParserService {

  private regexs = {
    newline: /\r?\n/,
    header: /\[(?:\s*?(title|bpm|artist|books)\s*:\s*([\w\s-_]*)\s*(?:;|\])?)?(?:\s*?(title|bpm|artist|books)\s*:\s*([\w\s-_]*)\s*(?:;|\]){1})?(?:\s*?(title|bpm|artist|books)\s*:\s*([\w\s-_]*)\s*(?:;|\]){1})?(?:\s*?(title|bpm|artist|books)\s*:\s*([\w\s-_]*)\s*(?:;|\]){1})?/gi,
    block: /\[(?:Block\s*:\s*)([\w\s-_]*)\]/gi,
    order: /\[(?:order\s*:\s*)([\w\s-_,]*)\]/gi,
    chord: /(?:\[\s*)([\w\#]*)(?:\s*\])/gi,
    invChord: /([\w\#]+)/gi
  }

  constructor() { }

  public obj2PDF( song:Song ){
  }

  public obj2Str( song:Song ): string {
    let str = this.meta2str(song);

    //blocks
    for(let block of song.blocks){
      str += this._block2str(block)+'\n';
    }

    return str;
  }

  public str2Obj( str:string ): Song {
    let newSong = new Song();
    // get meta
    let meta = this._getMeta(str);
    for(let m in meta){
      newSong[m] = meta[m];
    }
    
    // get blocks
    newSong.blocks = this._getAllBlocks(str);
    
    return newSong;
  }

  private _getMeta(str:string): object {
    let meta = {};
    
    let order = this.regexs.order.exec(str);
    if(order){
      meta['order'] = this._deepTrim(order[1].split(','));
    }
    
    let matches = this.regexs.header.exec(str);
    if(matches && matches.length > 2){

      for(let i = 1; i < matches.length; i+=2){
        if(matches[i] && matches[i] !== 'books')
          meta[matches[i]] = matches[i+1];
        else if(matches[i])
          meta[matches[i]] = this._deepTrim(matches[i+1].split(','));
      }
    }
    return meta;
  }

  private _getAllBlocks(str:string): Block[]{
    let blocks: Block[] = [];
    let blockStarts: number[] = [];
    let titles: string[] = [];
    let m;
    do{
      m = this.regexs.block.exec(str);
      if(m){
        blockStarts.push(m.index);
        titles.push(m[1]);
      }
    } while(m);

    for (let i = 0; i < blockStarts.length; i++) {
      let block;
      if(i+1 === blockStarts.length)
        block = str.substr(blockStarts[i]);
      else
        block = str.substr(blockStarts[i], blockStarts[i+1] - blockStarts[i]);
      blocks.push(this._getBlock(titles[i], block));
    }
    return blocks;
  }

  private _getBlock(title:string, str:string): Block{
    let newBlock = new Block();
    newBlock.title = title;
    newBlock.lines = this._getAllLines(str);

    newBlock.lines.forEach((val, index, arr) => {
      newBlock.maxLineWidth = this._max(val.lyricsWidth, newBlock.maxLineWidth);
      newBlock.maxDiffAnnotationsPerRepition = this._max(val.differentAnnotations, newBlock.maxDiffAnnotationsPerRepition);
      newBlock.annotationCells = this._max(val.annotationCells, newBlock.annotationCells);
    })
    return newBlock;
  }

  private _getAllLines(str:string): Line[]{
    let lines: Line[] = [];
    for (let l of str.split(this.regexs.newline)) {
      if(l.trim() === '' || this.regexs.block.test(l))
        continue;
      let line = this._getLine(l);
      lines.push(line);
    }
    return lines;
  }

  private _getLine(str:string): Line {
    let newLine: Line = new Line();
    newLine.lyrics.bottomLine = str;
    let matches = [];

    let m;
    do{
      m = this.regexs.chord.exec(str);
      if(m){
        matches.push(m);
        newLine.lyrics.bottomLine = newLine.lyrics.bottomLine.replace(m[0], '');
      }
    } while(m);

    let annotationblocks = newLine.lyrics.bottomLine.split('|');
    newLine.annotationCells = annotationblocks.length - 1;
    for (let anno of annotationblocks) {
      if(anno === annotationblocks[0])
        continue;
      
      let annotations = this._deepTrim(anno.split(';'));
      newLine.differentAnnotations = this._max(newLine.differentAnnotations, annotations.length);
      newLine.annotations.push(annotations);
    }
    
    let offset = 0;
    for (let i = 0; i < matches.length; i++){
      let len = matches[i].index - newLine.lyrics.topLine.length - offset + 1;
      len = len > 0 ? len : 2;
      offset += matches[i][0].length;
      newLine.lyrics.topLine += Array(len).join(" ") + matches[i][1];
    }
    newLine.lyrics.bottomLine = annotationblocks[0];
    newLine.lyricsWidth = newLine.lyrics.bottomLine.length;
    return newLine;
  }

  private _max(a,b){
    return a > b ? a : b;
  }

  private _deepTrim(arr:string[]): string[]{
    let res: string[] = [];
    arr.forEach((val, index, arr) => {
      res.push(val.trim());
    });
    return res;
  }

  public meta2str(song: Song): string{
    let str = '';
    //meta
    let title = song.title !== "" ? 'title: '+song.title+';' : '';
    let artist = song.artist !== "" ? 'artist: '+song.artist+';' : '';
    let bpm = song.bpm ? 'title: '+song.bpm+';' : '';
    let books = song.books ? 'books: '+song.books.join(',')+';' : '';
    str += '['+title+artist+bpm+books+']\n\n';

    //order
    let order = song.order ? '[order: '+song.order.join(',')+']' : '';
    str += order+'\n\n';
    return str;
  }

  private _block2str(block:Block):string{
    let str = '[block: '+block.title+']\n';

    for(let l of block.lines){
      str += this._joinTopAndBottomLine(l)+this._joinAnnotations(l)+'\n';
    }

    return str;
  }

  private _joinTopAndBottomLine(line:Line): string {
    let finalLine = [];

    let m;
    let matches = [];
    do{
      m = this.regexs.invChord.exec(line.lyrics.topLine);
      if (m) {
        matches.push(m);
      }
    } while(m);

    matches = matches.reverse(); // to ensure correct position
    for(let i = 0; i <= matches.length; i++) {
      // if last part start from 0
      let start = i === matches.length ? 0 : matches[i].index;
      // if first -> until end else prev position
      let end = i === 0 ? undefined : i === matches.length ? matches[i-1].index : matches[i-1].index - matches[i].index;
      finalLine.push(line.lyrics.bottomLine.substr(start, end));

      if(i < matches.length)
        finalLine.push('['+matches[i][1]+']');
    }

    return finalLine.reverse().join('');
  }

  private _joinAnnotations(l:Line): string {
    let annotations = [];

    for(let anno of l.annotations) {
      annotations.push(anno.join('; '));
    }

    return ' | '+annotations.join('| ');
  }
}
