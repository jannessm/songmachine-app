import { Line } from './line';

/**
 * Block class
 * @property {string} title - Title of block
 * @property {Object} lines - Array of Line objects
 * @property {number} annotationCells - how many annotation cells are needed
 * @property {number} lyricsWidth - maximum width of lyrics
 * @property {number} maxDiffAnnotationsPerRepition - maximum different annotations per repetition
 * @property {number} printed - how often a block is printed
 * */
export class Block {
    title: string;
    lines: Line[];
    annotationCells: number;
    maxLineWidth = 0;
    maxDiffAnnotationsPerRepition: number;
    printed?: number;
}
