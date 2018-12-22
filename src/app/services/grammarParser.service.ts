import { NearleyResultObj } from '../models/grammars/generalModels';
import { Injectable } from '@angular/core';

const nearley = require('nearley');
const stGrammar = require('../../assets/grammars/st-grammar.js');

@Injectable()
export class GrammarParser {

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

  constructor() { }

  public parse(input: string, keepChars: boolean = false, tag: string = 'pre') {
    const stParser = new nearley.Parser(nearley.Grammar.fromCompiled(stGrammar));
    try {
      stParser.feed(input);
    } catch (e) {
      console.log(e);
    }
    if (!stParser.results) {
      return '';
    }
    const results = this.flattenResults(stParser.results[0]);
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

  private flattenResults(results, reduced = []) {
    if (!results || !results[0]) {
      return reduced;
    }

    return [results[0]].concat(this.flattenResults(results[1]));
  }
}
