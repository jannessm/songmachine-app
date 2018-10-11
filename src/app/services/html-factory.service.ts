import { Injectable } from '@angular/core';

import { Song } from '../models/song';
import { Block } from '../models/block';

@Injectable()
export class HtmlFactoryService {

  private bpm_image = "data:image/jpeg;base64,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";
  private books_image = "data:image/jpeg;base64,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";

  constructor() { }

  public highlightText(text:string): string[]{
    return text
        .split('\n')
        .map(line =>`<pre class="line-wrapper">${ this._markdown(line, true) }</pre>`);
   }

  public song2html(song:Song): string {
    const title = song.title || '';
    const artist = song.artist || '';
    const bpm = song.bpm || '';
    const books = song.books || [];

    let html = '<div class="page">';

    // header
    html += '<div class="title"><h1>'+title+'</h1><div class="artist">'+artist+'</div></div>';
    html += '<div class="bpm"><div class="bpm_img"></div>'+bpm+'</div>';

    html += '<div class="books"><div class="books_img"></div><ul>';
    for (let b of books) {
      html += '<li>'+b+'</li>';
    }
    html += '</ul></div>';

    if (!song.order){
      for (let b of song.blocks) {
        html += this._block2html(b, song.annotationCells, song.maxLineWidth);
      }
    } else {
      for (let b of song.order) {
        const block = song.blocks.find(elem => {
          return elem.title === b;
        });
        html += this._block2html(block, song.annotationCells, song.maxLineWidth);
      }
    }

    return html+'</div>'+this._style();
  }

  private _block2html(block:Block, cells:number, maxLineWidth: number): string {
    let html = '<div class="block">';

    html += '<h4>'+block.title+'</h4>';
    html += '<table class="block_table">';

    for (let l of block.lines){
      html += '<tr><td style="width: '+maxLineWidth*6.5+'pt"><pre>'+this._markdown(l.lyrics.topLine)+'</pre></td>';
      html += this._extendMissingCells(0, cells);
      html += '</tr>';
      
      html += '<tr><td style="width: '+maxLineWidth*6.5+'pt"><pre>'+this._markdown(l.lyrics.bottomLine)+'</pre></td>';

      let c = 0;
      for (let ann of l.annotations) {
        const id = ann.length > 1 ? l.printed : 0;
        html += '<td class="annotation_border"><pre>'+this._markdown(ann[id])+'</pre></td>';
        l.printed++;
        c++;
      }
      html += this._extendMissingCells(c, cells);
      html += '</tr>';
    }

    return html+'</table></div>';
  }

  private _extendMissingCells(c: number, cells: number): string{
    let html = '';
    while (c <= cells){
      html += '<td class="annotation_border"></td>';
      c++;
    }
    return html;
  }

  private _markdown(str:string, editorParsing:boolean = false): string {
    if (!str)
      return '';
    let bold, italic, orange, firstStarted, doNotAdd = false;
    let colorStack = [];
    let ignoreNext = 0;
    let html = '';
    const arr = str.split('');

    // iterate over chars and add styling
    arr.forEach((char, id, arr) => {
      let grey, update = false;

      if (ignoreNext > 0){
        ignoreNext--;
        doNotAdd = false;
        return;
      }
      
      if(char === '*'){
        update = true;
        let countStars;

        for(countStars = 1; countStars < 4 && arr.length > id+countStars; countStars++){
          if (arr[id+countStars] !== '*')
            break;
        }

        italic = countStars % 2 === 1 ? !italic : italic;
        bold = countStars > 1 ? !bold : bold;

        ignoreNext = countStars - 1;
        if(editorParsing){
          for( let i = 0; i < ignoreNext; i++){
            html += arr[id+i];
          }
        }

      } else if(id+2 < arr.length && /<(r|g|b)>/gi.test(char+arr[id+1]+arr[id+2])){
        update = true;
        if (colorStack.includes(arr[id+1])){
          colorStack = this._removeColor(arr[id+1], colorStack);
          if(editorParsing){
            html += this._escapeHTML(char)+this._escapeHTML(arr[id+1])+this._escapeHTML(arr[id+2]);
            doNotAdd = true;
          }
        }else{
          colorStack.push(arr[id+1]);
        }
        ignoreNext = !editorParsing ? 2 : 0;
      } else if(editorParsing && char === '['){
        update = true;
        grey = true;
        orange = true;
      } else if((arr[id-1] === '[' && char !== ']') || arr[id-1] === ']'){
        update = true;
      } else if(editorParsing && char === ']'){
        update = true;
        orange = false;
        grey = true;
      }

      //update
      if(update){
        const closingTag = firstStarted ? '</pre>' : '';
        const letter = editorParsing && !doNotAdd ? this._escapeHTML(char) : '';
        html += closingTag+'<pre class="'+this._getMarkdownClasses(bold, italic, colorStack, grey, orange)+'">'+letter;
        firstStarted = true;
      }else if(!doNotAdd){
        html += this._escapeHTML(char);
      }

      if(/<(r|g|b)>/gi.test(arr[id-2]+arr[id-1]+char)){
        doNotAdd = false;
      }
    })
    return html;
  }

  private _escapeHTML(char:string):string{
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
        '|': '&#124;'
    };
    return entityMap[char] ? entityMap[char] : char;
  }

  private _removeColor(color, arr){
    return arr.filter(val => {
      return val !== color;
    });
  }

  private _getMarkdownClasses(bold:boolean, italic:boolean, colorStack: string[], grey:boolean = false, orange:boolean = false): string{
    const b = bold ? 'bold':'';
    const i = italic ? 'italic':'';
    const colors = {
      'r': 'red',
      'g': 'green',
      'b': 'blue'
    }
    const color = colorStack.length > 0 && !grey ? colors[colorStack[colorStack.length - 1]] : '';
    const g = grey ? 'grey' : '';
    const o = orange && !grey ? 'orange' : '';
    return [b, i, color, g, o].join(' ');
  }

  private _style(): string{
    return `<style>
      .page {
        width: 595.3pt;
        min-height: 841.9pt;
        background: white;
        font-family: 'RobotoMono', monospace;
        font-size: 10pt;
        box-sizing: border-box;
        display: inline-block;
        padding: 15pt;
      }
      .page .title, .page .artist, .page .bpm, .page .bpm_img, .page .books, .page .books_img, .page ul {
        display: inline-block;
      }
      
      .page .title{
        width: 70%;
      }
      .page .artist{
        margin-left: 20px;
      }

      .page .bpm{
        margin-right: 20pt;
      }
      .page .bpm_img, .page .books_img{
        width: 24px;
        height: 24px;
        margin-right: 15pt;
      }
      .page .bpm_img{
        background: url(${this.bpm_image}) no-repeat;
        background-size: contain;
        background-position: center;
      }
      .page .books_img{
        background: url(${this.books_image}) no-repeat;
        background-size: contain;
        background-position: center;
      }

      .page .block{
        margin-bottom: 20px;
      }

      .page h1, .page h4 {
        padding-left: 20px;
        margin-bottom: 0;
      }
      .page pre, .page pre pre{
        display: inline-block;
        margin: 0;
      }
      .page ul {
        padding: 0;
      }
      .page li {
        display: block !important;
      }
      .page table {
        width: 100%;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-collapse: collapse;
      }
      .page tr {
        padding-left: 20px;
      }
      .page .annotation_border{
        border-left: 1px solid black;
      }
      .page .red{
        color: red;
      }
      .page .blue{
        color: blue;
      }
      .page .green{
        color: green;
      }
      .page .bold{
        font-weight: bold;
      }
      .page .italic{
        font-style: italic;
      }
      </style>`;
  }

}
