import { Block } from './block';

/**
 * Line object
 * @property {string[]} lyrics - [topLine, bottomLine] with lyrics and chords
 * @property {string[]} annotations - array of all annotaions
 * @property {number} width - maximum width of lyrics
 * @property {number} differentAnnotations - different annotations per repetition
 * @property {number} annotationCells - how many annotation cells are defined
 * @property {Block} parent - block where this line is in
 * */
export class Line {
    lyrics: Lyric = new Lyric();
    annotations: string[][] = [];
    lyricsWidth: number;
    differentAnnotations = 0;
    annotationCells = 0;
    printed = 0;
}

class Lyric {
    topLine = '';
    bottomLine = '';
}
