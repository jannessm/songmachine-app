import { Injectable } from '@angular/core';

import { Song } from '../models/song';
import { Block } from '../models/block';

import {bpm_image, books_image} from '../../assets/icons/base64';

@Injectable()
export class HtmlFactoryService {

  private bpm_image: string;
  private books_image: string;

  constructor() {
    this.bpm_image = bpm_image;
    this.books_image = books_image;
  }

  public highlightText(text: string): string[] {
    return text
        .split('\n')
        .map(line => `<pre class="line-wrapper">${ this.markdown(line, true) }</pre>`);
   }

  public songToHTML(song: Song): string {
    if (!song) {
      return '';
    }
    const title = song.title || '';
    const artist = song.artist || '';
    const bpm = song.bpm || '';
    const books = song.books || [];

    let html = `
    <div class="page">
      <div class="title">
        <h1>${title}</h1>
        <div class="artist">${artist}</div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        ${bpm}
      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul>`;

    for (const b of books) {
      html += `<li>${b}</li>`;
    }
    html += '</ul></div>';

    if (!song.order && song.blocks) {
      for (const b of song.blocks) {
        html += this.blockToHTML(b, song.annotationCells, song.maxLineWidth);
      }
    } else if (song.blocks) {
      for (const b of song.order) {
        const block = song.blocks.find(elem => {
          return elem.title === b;
        });
        html += this.blockToHTML(block, song.annotationCells, song.maxLineWidth);
      }
    }

    return html + '</div>' + this.style();
  }

  private blockToHTML(block: Block, cells: number, maxLineWidth: number): string {
    if (!block) {
      return '';
    }
    let html = `<div class="block">
      <h4>${block.title}</h4>
      <table class="block_table">`;

    for (const l of block.lines) {
      html += `<tr>
        <td style="width: ${maxLineWidth * 6.5}pt">
          <pre>${this.markdown(l.lyrics.topLine)}</pre>
        </td>
        ${this.extendMissingCells(0, cells)}
      </tr>
      <tr>
        <td style="width: ${maxLineWidth * 6.5}pt">
          <pre>${this.markdown(l.lyrics.bottomLine)}</pre>
        </td>`;

      let c = 0;
      for (const ann of l.annotations) {
        const id = ann.length > 1 ? l.printed : 0;
        html += `<td class="annotation_border"><pre> ${this.markdown(ann[id])}</pre></td>`;
        c++;
      }
      l.printed++;
      html += this.extendMissingCells(c, cells);
      html += '</tr>';
    }

    return html + '</table></div>';
  }

  private extendMissingCells(c: number, cells: number): string {
    let html = '';
    while (c < cells) {
      html += '<td class="annotation_border"></td>';
      c++;
    }
    return html;
  }

  private markdown(str: string, editorParsing: boolean = false): string {
    if (!str) {
      return '';
    }
    let bold, italic, orange, firstStarted, doNotAdd = false;
    let colorStack = [];
    let ignoreNext = 0;
    let html = '';
    const arr = str.split('');

    // iterate over chars and add styling
    arr.forEach((char, id) => {
      let grey, update = false;

      if (ignoreNext > 0) {
        ignoreNext--;
        doNotAdd = false;
        return;
      }

      if (char === '*') {
        update = true;
        let countStars;

        for (countStars = 1; countStars < 4 && arr.length > id + countStars; countStars++) {
          if (arr[id + countStars] !== '*') {
            break;
          }
        }

        italic = countStars % 2 === 1 ? !italic : italic;
        bold = countStars > 1 ? !bold : bold;

        ignoreNext = countStars - 1;
        if (editorParsing) {
          for ( let i = 0; i < ignoreNext; i++) {
            html += arr[id + i];
          }
        }

      } else if (id + 2 < arr.length && /<(r|g|b)>/gi.test(char + arr[id + 1] + arr[id + 2])) {
        update = true;
        if (colorStack.includes(arr[id + 1])) {
          colorStack = this.removeColor(arr[id + 1], colorStack);
          if (editorParsing) {
            html += this.escapeHTML(char) + this.escapeHTML(arr[id + 1]) + this.escapeHTML(arr[id + 2]);
            doNotAdd = true;
          }
        } else {
          colorStack.push(arr[id + 1]);
        }
        ignoreNext = !editorParsing ? 2 : 0;
      } else if (editorParsing && char === '[') {
        update = true;
        grey = true;
        orange = true;
      } else if ((arr[id - 1] === '[' && char !== ']') || arr[id - 1] === ']') {
        update = true;
      } else if (editorParsing && char === ']') {
        update = true;
        orange = false;
        grey = true;
      }

      // update
      if (update) {
        const closingTag = firstStarted ? '</pre>' : '';
        const letter = editorParsing && !doNotAdd ? this.escapeHTML(char) : '';
        html += closingTag + '<pre class="' + this.getMarkdownClasses(bold, italic, colorStack, grey, orange) + '">' + letter;
        firstStarted = true;
      } else if (!doNotAdd) {
        html += this.escapeHTML(char);
      }

      if (/<(r|g|b)>/gi.test(arr[id - 2] + arr[id - 1] + char)) {
        doNotAdd = false;
      }
    });
    return html;
  }

  private escapeHTML(char: string): string {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;',
        '|': '&#124;',
        '♮': '&#9838;'
    };
    return entityMap[char] ? entityMap[char] : char;
  }

  private removeColor(color, arr) {
    return arr.filter(val => val !== color);
  }

  private getMarkdownClasses(
    bold: boolean,
    italic: boolean,
    colorStack: string[],
    grey: boolean = false,
    orange: boolean = false
    ): string {
    const b = bold ? 'bold' : '';
    const i = italic ? 'italic' : '';
    const colors = {
      'r': 'red',
      'g': 'green',
      'b': 'blue'
    };
    const color = colorStack.length > 0 && !grey ? colors[colorStack[colorStack.length - 1]] : '';
    const g = grey ? 'grey' : '';
    const o = orange && !grey ? 'orange' : '';
    return [b, i, color, g, o].join(' ');
  }

  private style(): string {
    return `<style>
      .page {
        width: 595.3pt;
        min-height: 841.9pt;
        background: white;
        font-family: 'Ubuntu Mono', monospaced;
        font-size: 10pt;
        box-sizing: border-box;
        display: inline-block;
        padding: 15pt;
      }
      .page .title, .page .artist, .page .bpm, .page .bpm_img, .page .books, .page .books_img, .page ul {
        display: inline-block;
      }

      .page .title{
        width: 60%;
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
        font-family: 'Ubuntu Mono', monospaced;
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
