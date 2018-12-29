export interface NearleyResultObj {
  css: string;
  content: string;
  isTerminal: boolean;
}

export interface NearleyParser {
  feed: Feed;
  rewind: Rewind;
  results: Array<any>;
}

type Feed = (input: string) => NearleyParser;
type Rewind = (index: number) => NearleyParser;
