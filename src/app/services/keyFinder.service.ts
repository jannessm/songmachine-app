import { Injectable } from '@angular/core';
import { ChordKeys, overtones } from '../models/keys';

import * as _ from 'underscore';

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
    console.log(topKeys);
    return topKeys.keys[0];
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
    chords
      .filter((val, id) => chords.findIndex(c => c === val) === id)
      .forEach(chord => {
        Object.keys(ChordKeys).forEach(key => {
          if (!counts[key]) {
            counts[key] = 0;
          }
          const id = ChordKeys[key].findIndex(val => val === chord);
          if (id > -1) {
            // const overtoneId = overtones.findIndex(val => val.findIndex(i => id === i) > -1);
            // console.log(overtoneId, key, chord);
            // const factor = overtoneId ? overtoneId * 0.333 + 1 : 1;
            counts[key] += 1;
          }
        });
      });
    return {
      keys: Object.keys(counts)
        .filter(key => counts[key] !== 0)
        .sort((a, b) => counts[b] - counts[a]),
      scores: Object.keys(counts)
        .filter(key => counts[key] !== 0)
        .sort((a, b) => counts[b] - counts[a])
        .map(key => counts[key])
      };
  }
}
