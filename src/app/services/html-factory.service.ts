import { Injectable } from '@angular/core';

import { Song } from '../models/song';
import { Block } from '../models/block';
import { GrammarParser } from './grammar-parser.service';
import { TranslationService } from './translation.service';

const convert = require('xml-js');

@Injectable()
export class HtmlFactoryService {

  private bpm_image = '';
  private books_image = '';

  constructor(private grammarParser: GrammarParser, private translationService: TranslationService) {
  }

  public highlightText(text: string): string[] {
    return text
      .split('\n')
      .map(line => line.split('|').map(val => this.markdown(val, true)).join('<pre>|</pre>')) // each text has to be inside of <pre>
      .map(line => `<pre class="line-wrapper">${ line }</pre>`);
  }

  public addTooltips(htmlLines: string[]): string[] {
    // return htmlLines.map(line => {
    //   const xml = convert.xml2js(line);
    //   xml.elements[0].elements.map(tag => this.addTooltipXml(tag));
    //   return convert.js2xml(xml);
    // });
    return htmlLines;
  }

  private addTooltipXml(xmlObj) {
    if (xmlObj.attributes && /error/.test(xmlObj.attributes.class)) {
      const inner = xmlObj.elements[0].text;
      let tooltip = '';
      if (inner === '[' || inner === ']') {
        tooltip = this.translationService.i18n('editor.brackets.error');
      } else if (/[<>]/.test(inner)) {
        tooltip = this.translationService.i18n('editor.colors.error');
      }
      xmlObj.elements.push({
        type: 'element',
        name: 'span',
        elements: [{
          type: 'text',
          text: tooltip
        }]
      });
    }

    return xmlObj;
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

    books.forEach(b => html += `<li>${b}</li>`);
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

    block.lines.forEach(line => {
      html += `<tr>
        <td style="width: ${maxLineWidth * 6.5}pt">
          <pre>${this.markdown(line.lyrics.topLine)}</pre>
        </td>
        ${this.extendMissingCells(0, cells)}
      </tr>
      <tr>
        <td style="width: ${maxLineWidth * 6.5}pt">
          <pre>${this.markdown(line.lyrics.bottomLine)}</pre>
        </td>`;

      let c = 0;
      for (const ann of line.annotations) {
        const id = ann.length > 1 ? line.printed : 0;
        html += `<td class="annotation_border"><pre> ${this.markdown(ann[id])}</pre></td>`;
        c++;
      }
      line.printed++;
      html += this.extendMissingCells(c, cells);
      html += '</tr>';
    });

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
    return this.grammarParser.parse(str, editorParsing);
  }

  public style(): string {
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
        font-weight: bold;
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
      .page .normal{
        font-style: normal;
        font-weight: normal;
        color: black;
      }
      </style>`;
  }

}
