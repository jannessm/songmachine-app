import { NearleyResultObj } from '../models/grammars/generalModels';
import { Injectable } from '@angular/core';

const nearley = require('nearley');
const stGrammar = require('../../assets/grammars/st-grammar.js');
const editorGrammar = require('../../assets/grammars/editor-grammar.js');
const chordsGrammar = require('../../assets/grammars/chords-grammar.js');

@Injectable()
export class GrammarParser {

  public static escapeHTML(char: string): string {
    if (char && char.length === 1) {
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
    const isBalanced = this.checkBalancedBrackets(input);
    if (!!isBalanced) {
      return isBalanced;
    }

    let parser;
    if (!keepChars) {
      parser = new nearley.Parser(nearley.Grammar.fromCompiled(stGrammar));
    } else {
      parser = new nearley.Parser(nearley.Grammar.fromCompiled(editorGrammar));
    }

    try {
      parser.feed(input);
    } catch (err) {
      console.log(err);
    }
    if (!parser.results || (parser.results && parser.results.length === 0)) {
      return '';
    }

    const results = parser.results[0];
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

  public parseChords(input: string): string[] {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(chordsGrammar));
    try {
      parser.feed(input);
    } catch (err) {
      console.log(err);
    }

    if (!parser.results || (parser.results && parser.results.length === 0)) {
      return [];
    }

    return parser.results[0].reduce((reduced, curr) => {
      if (typeof curr === 'string' && reduced.length === 0) {
        reduced.push(curr);
      } else if (typeof curr === 'string') {
        reduced.push(reduced.pop() + curr);
      } else if (curr.isChord) {
        reduced.push({chord: curr.char.join('')});
        reduced.push('');
      }
      return reduced;
    }, []);
  }

  private checkBalancedBrackets(input: string, tag: string = 'pre'): string {
    const stack = [];

    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (char === '[' && stack.length === 0) {
        stack.push(i);
      } else if (char === '[' && stack.length > 0) {
        return this.composeError(input, stack.pop(), 1, tag);
      } else if (char === ']' && stack.length === 1) {
        stack.pop();
      } else if (char === ']' && stack.length === 0) {
        return this.composeError(input, i, 1, tag);
      }
    }

    if (stack.length === 0) {
      return '';
    }
  }

  private composeError(input: string, from: number, length: number, tag: string = 'pre'): string {
    return `<${tag}>${input.substr(0, from)}</${tag}>` +
      `<${tag} class="error">${input.substr(from, length)}</${tag}>` +
      `<${tag}>${input.substr(from + length)}</${tag}>`;
  }
}
