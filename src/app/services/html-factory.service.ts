import { Injectable } from '@angular/core';

import { Song } from '../models/song';
import { Block } from '../models/block';
import { GramarSt } from '../models/gramar';
import { TreeNode } from '../models/tree';

@Injectable()
export class HtmlFactoryService {

  private bpm_image = '';
  private books_image = '';

  constructor() {
    // this.bpm_image = bpm_image;
    // this.books_image = books_image;
  }

  public highlightText(text: string): string[] {
    return text
        .split('\n')
        .map(line => line.split('|').map(val => this.markdown(val, true)).join('<pre>|</pre>')) // each text has to be inside of <pre>
        .map(line => `<pre class="line-wrapper">${ line }</pre>`);
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
    const parseTree = this.buildParsingTree(str);
    let html = str;
    if (GramarSt.red.regex.test(str) ||
      GramarSt.green.regex.test(str) ||
      GramarSt.blue.regex.test(str) ||
      GramarSt.bold.regex.test(str) ||
      GramarSt.italic.regex.test(str) ||
      GramarSt.boldItalic.regex.test(str)) {
      html = this.recursiveMarkdown(parseTree, editorParsing);
    }
    return html;
  }

  private recursiveMarkdown(root: TreeNode, editorParsing: boolean): string {
    let html = '<pre>';

    root.children.sort((a, b) => a.children.length - b.children.length);
    root.children.forEach(node => {
      if (!node.hasChildren) {
        // if editorParsing and markdown data
        if (editorParsing && (GramarSt.red.regex.test(node.data) ||
          GramarSt.green.regex.test(node.data) ||
          GramarSt.blue.regex.test(node.data) ||
          GramarSt.bold.regex.test(node.data) ||
          GramarSt.italic.regex.test(node.data) ||
          GramarSt.boldItalic.regex.test(node.data))) {
            if (node.getSibling() && (node.getSibling().data.length < root.data.length || node.getSibling().data === 'S')) {
              html += this.escapeHTML(node.data);
              html += `</pre><pre class="${this.getMarkdownClasses(node.getSibling().data)}">`;
            } else if (node.getSibling()) {
              html += `</pre><pre class="${this.getMarkdownClasses(node.getSibling().data)}">`;
              html += this.escapeHTML(node.data);
            } else {
              html += this.escapeHTML(node.data);
            }
        // if not editorParsing and not markdown data
        } else if (!(GramarSt.red.regex.test(node.data) ||
        GramarSt.green.regex.test(node.data) ||
        GramarSt.blue.regex.test(node.data) ||
        GramarSt.bold.regex.test(node.data) ||
        GramarSt.italic.regex.test(node.data) ||
        GramarSt.boldItalic.regex.test(node.data))) {
          html += this.escapeHTML(node.data);
        } else if (node.getSibling()) {
          html += `</pre><pre class="${this.getMarkdownClasses(node.getSibling().data)}">`;
        }
      } else {
        html += this.recursiveMarkdown(node, editorParsing);
      }
    });
    return html + '</pre>';
  }

  private buildParsingTree(str: string): TreeNode {
    const root = new TreeNode();
    let ignoreNext = 0;
    let currTransitions: string[] = GramarSt.S;
    let currState = 'S';
    let currNode: TreeNode = root;
    root.data = currState;

    str.split('').forEach((char, i, arr) => {
      if (ignoreNext > 0) {
        ignoreNext--;
        return;
      }

      let lookahead = char;
      lookahead += arr[i + 1] ? arr[i + 1] : '';
      lookahead += arr[i + 2] ? arr[i + 2] : '';

      if (GramarSt.boldItalic.regex.test(lookahead)) {
        ignoreNext = 2;

        currState = currTransitions[GramarSt.boldItalic.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(lookahead);
        if (i + 3 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else if (GramarSt.red.regex.test(lookahead)) {
        ignoreNext = 2;

        currState = currTransitions[GramarSt.red.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(lookahead);
        if (i + 3 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else if (GramarSt.green.regex.test(lookahead)) {
        ignoreNext = 2;

        currState = currTransitions[GramarSt.green.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(lookahead);
        if (i + 3 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else if (GramarSt.blue.regex.test(lookahead)) {
        ignoreNext = 2;

        currState = currTransitions[GramarSt.blue.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(lookahead);
        if (i + 3 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else if (GramarSt.bold.regex.test(lookahead)) {
        ignoreNext = 1;

        currState = currTransitions[GramarSt.bold.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(arr[i] + arr[i + 1]);
        if (i + 2 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else if (GramarSt.italic.regex.test(lookahead)) {
        currState = currTransitions[GramarSt.italic.id];
        currTransitions = GramarSt[currState];
        currNode.createChild(arr[i]);
        if (i + 1 < arr.length) {
          currNode = currNode.createChild(currState);
        }

      } else {
        currNode.createChild(arr[i]);
        if (i + 1 < arr.length) {
          currNode = currNode.createChild(currState);
        }
      }
    });

    return root;
  }

  private escapeHTML(char: string): string {
    if (char.length === 1) {
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
    } else {
      return char.split('').map(c => this.escapeHTML(c)).join('');
    }
  }

  private getMarkdownClasses(state: string): string {
    switch (state) {
      case 'R': return 'red';
      case 'G': return 'green';
      case 'B': return 'blue';
      case 'Bo': return 'bold';
      case 'I': return 'italic';
      case 'RI': return 'red italic';
      case 'GI': return 'green italic';
      case 'BI': return 'blue italic';
      case 'BoI': return 'bold italic';
      case 'RBo': return 'red bold';
      case 'GBo': return 'green bold';
      case 'BBo': return 'blue bold';
      case 'RBoI': return 'red bold italic';
      case 'GBoI': return 'green bold italic';
      case 'BBoI': return 'blue bold italic';
      default: return '';
    }
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
      </style>`;
  }

}
