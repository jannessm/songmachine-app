import { Block } from "./block";

export class Song {
  id?: string;
  title: string = '';
  artist?: string;
  bpm?: number;
  books?: string[];
  blocks: Block[] = [];
  order?: string[];
  annotationCells: number = 0;
  maxLineWidth: number = 0;
  preview?: string;

  constructor(song?: string | any){
    if(typeof song === 'string'){
      this.title = song;
    }else if(song){
      this.id = song.id || undefined;
      this.title = song.title || '';
      this.artist = song.artist || undefined;
      this.bpm = song.bpm || undefined;
      this.books = song.books || undefined;
      this.blocks = song.blocks || undefined;
      this.order = song.order ||  undefined;
      this.annotationCells = song.annotationCells || 0;
      this.maxLineWidth = song.maxLineWidth || 0;
      this.preview = song.preview || undefined;
    }
  }
}