import { Block } from './block';

export class Song {
  id?: string;
  title = '';
  artist?: string;
  bpm?: number;
  books?: string[];
  blocks: Block[] = [];
  order?: string[];
  annotationCells = 0;
  maxLineWidth = 0;
  preview?: string;

  constructor(song?: string | any) {
    if (typeof song === 'string') {
      this.title = song;
    } else if (song) {
      this.id = song.id || undefined;
      this.title = song.title || '';
      this.artist = song.artist || undefined;
      this.bpm = song.bpm || undefined;
      this.books = song.books || [];
      this.blocks = song.blocks || [];
      this.order = song.order ||  [];
      this.annotationCells = song.annotationCells || 0;
      this.maxLineWidth = song.maxLineWidth || 0;
      this.preview = song.preview || undefined;
    }
  }
}
