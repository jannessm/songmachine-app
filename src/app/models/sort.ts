import { Moment } from 'moment';
import moment = require('moment');

export enum SortDirection {
  ASC = 1,
  DESC = -1
}

export enum SortType {
  LEXICAL = 'lexical',
  DATE = 'date'
}

export const SortFunctions: SortFunction[] = [
  {
    name: SortType.LEXICAL,
    func: (a: string, b: string) => {
      return a.localeCompare(b);
    }
  },
  {
    name: SortType.DATE,
    func: (a: Moment, b: Moment) => {
      if (!a) {
        a = moment();
      }
      if (!b) {
        b = moment();
      }
      return a.diff(b) > 0 ? 1 : -1;
    }
  }
];

export interface SortFunction {
  name: SortType;
  func: Function;
}
