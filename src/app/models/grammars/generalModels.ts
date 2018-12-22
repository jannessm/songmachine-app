export interface NearleyResultObj {
  css: string;
  content: string;
  isTerminal: boolean;
}

export interface GrammarRegex {
  id: number;
  regex: RegExp;
  ignoreNext: number;
}
