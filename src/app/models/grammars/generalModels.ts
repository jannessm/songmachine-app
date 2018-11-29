export interface Grammar {
  regexs: GrammarRegex[];
  transitions: GrammarTransitions;
  start: string;
  cssClasses: GrammarCssClasses;
}

export interface GrammarRegex {
  id: number;
  regex: RegExp;
  ignoreNext: number;
}

export interface GrammarTransitions {
  [key: string]: string[];
}

export interface GrammarCssClasses {
  [state: string]: string;
}
