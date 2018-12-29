import { NearleyResultObj, NearleyParser } from '../models/grammars/generalModels';
import { Injectable } from '@angular/core';

const nearley = require('nearley');
const flatten = require('array-flatten');
const stGrammar = require('../../assets/grammars/st-grammar.js');
const editorGrammar = require('../../assets/grammars/editor-grammar.js');

@Injectable()
export class GrammarParser {

  stParser: NearleyParser;
  editorParser: NearleyParser;

  public static escapeHTML(char: string): string {
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
    } else if (char) {
      return char.split('').map(c => GrammarParser.escapeHTML(c)).join('');
    }
  }

  constructor() {
    this.stParser = new nearley.Parser(nearley.Grammar.fromCompiled(stGrammar));
    this.editorParser = new nearley.Parser(nearley.Grammar.fromCompiled(editorGrammar));
  }

  public parse(input: string, keepChars: boolean = false, tag: string = 'pre') {
    let parser;
    if (!keepChars) {
      parser = this.stParser.rewind(0);
    } else {
      parser = this.editorParser.rewind(0);
    }

    try {
      parser.feed(input);
    } catch (err) {
      const errPos = input[err.offset] === '>' ? 0 : input[err.offset - 1] === '<' ? 1 : 2;
      const errLen = errPos === 0 ? 1 : errPos;

      return `<${tag}>${GrammarParser.escapeHTML(input.substring(0, err.offset - errPos))}` +
        `<${tag} class="error">${GrammarParser.escapeHTML(input.substr(err.offset - errPos, errLen))}</${tag}>` +
        `${GrammarParser.escapeHTML(input.substr(err.offset - errPos + errLen))}`;
    }
    if (!parser.results) {
      return '';
    }

    const results = flatten(parser.results[0]);
    return `<${tag}>` + results.reduce((res, currVal, id, arr) => {
      let html = '';

      if (
        (id === 0 && typeof currVal === 'string') ||
        (id !== 0 && typeof currVal === 'string' && typeof arr[id - 1] === 'string')
      ) {
        html += GrammarParser.escapeHTML(currVal);
      } else if (
        id !== 0 && typeof currVal !== 'string' && typeof arr[id - 1] !== 'string' &&
        (<NearleyResultObj>currVal).css === (<NearleyResultObj>arr[id - 1]).css
      ) {
        html += GrammarParser.escapeHTML((<NearleyResultObj>currVal).content);
      } else if (
        (id !== 0 && typeof currVal === 'string' && typeof arr[id - 1] !== 'string')
      ) {
          html += `</${tag}><${tag}>${GrammarParser.escapeHTML(currVal)}`;
      } else if (
        (id === 0 && typeof currVal !== 'string') ||
        (id !== 0 && typeof currVal !== 'string' && (<NearleyResultObj>currVal).css !== (<NearleyResultObj>arr[id - 1]).css)
      ) {
        const str = keepChars || !(<NearleyResultObj>currVal).isTerminal ? GrammarParser.escapeHTML(currVal.content) : '';
        html += `</${tag}><${tag} class="${(<NearleyResultObj>currVal).css}">` + str;
      }

      return res + html;
    }, '') + `</${tag}>`;
  }
}
