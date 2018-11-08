import { Block } from './block';

export class Song {
  id?: string;
  title = '';
  artist?: string;
  bpm?: number;
  books?: string[];
  transposedBy = 0;
  blocks: Block[] = [];
  order?: string[];
  annotationCells = 0;
  maxLineWidth = 0;
  preview?: string;

  constructor(song?: string | any) {
    if (typeof song === 'string') {
      this.title = song;
    } else if (song) {
      this.id = song.id;
      this.title = song.title || '';
      this.artist = song.artist;
      this.bpm = song.bpm;
      this.books = song.books || [];
      this.blocks = song.blocks || [];
      this.order = song.order ||  [];
      this.annotationCells = song.annotationCells || 0;
      this.maxLineWidth = song.maxLineWidth || 0;
      this.preview = song.preview;
    }
  }
}
