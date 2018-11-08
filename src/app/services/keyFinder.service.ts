import { Injectable } from '@angular/core';
import { ChordKeys } from '../models/keys';

const _ = require('underscore');

@Injectable()
export class KeyFinderService {

  constructor() {}

  public findKey(string: string): string {
    const chords: string[] = [];
    this.getKeys(string).matches.forEach(elem => {
      if (elem[1]) {
        chords.push(elem[1]);
      }
    });

    const topKeys = this.topKeys(chords);

    return '';
  }

  public getKeys(string: string): {matches: RegExpExecArray[], flat: boolean} {
    let match;
    const matches = [];
    let flat = false;
    const chordReg = /\[\s*([^:]*?)\s*(?:\/([^:]*?))?\]/gi;
    do {
      match = chordReg.exec(string);
      if (match) {
        matches.push(match);
        if (match[1] && match[1][1] && match[1][1].toLowerCase() === 'b') {
          flat = true;
        }
        if (match[2] && match[2][1] && match[2][1].toLowerCase() === 'b') {
          flat = true;
        }
      }
    } while (match);

    return {matches, flat};
  }

  private topKeys(chords) {
    const counts = {};
    const results = [];
    _(ChordKeys).each((values, key) => {
      counts[key] = _(key).chain().intersection(chords).size().value();
    }, { chords });

    const max = _(counts).max();
    _(counts).each((value, key) => {
      if (value === max) {
        results.push(key);
      }
    }, { max });
    console.log(counts);
    console.log(results);
  }
}
