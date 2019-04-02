import { ParserService } from './parser.service';
import { TestBed } from '@angular/core/testing';
import { HtmlFactoryService } from './html-factory.service';
import { GrammarParser } from './grammar-parser.service';
import { Line } from '../models/line';

describe('UNIT Testing Parser Service:', () => {
  beforeEach(() => {
    const htmlFactory = jasmine.createSpyObj('HtmlFactoryService', ['songToHTML']);

    TestBed.configureTestingModule({
      providers: [
        ParserService,
        {provide: HtmlFactoryService, use: htmlFactory},
        GrammarParser
      ]
    });
  });

  describe('getBlock()', () => {
    it('should parse a block correctly', () => {
      const parser = TestBed.get(ParserService);
    });
  });

  describe('getAllLines()', () => {
    it('should parse a block of lines correctly', () => {
      const parser = TestBed.get(ParserService);
      const input = `<r>das [C]hier sind lyrics | eine tolle bla | noch <b>was anderes; tooooolllles | oder so
<r>das [C]hier sind lyrics | eine tolle bla | noch <b>was anderes; tooooolllles | oder so`;

      const res = parser.getAllLines(input);
      expect(res.length).toEqual(2);
    });
  });

  describe('getLine()', () => {
    it('should parse a line correctly', () => {
      const parser = TestBed.get(ParserService);
      const expected = new Line();
      expected.annotations = [['eine tolle bla'], ['noch <b>was anderes', 'tooooolllles'], ['oder so']];
      expected.annotationCells = 3;
      expected.differentAnnotations = 2;
      expected.lyrics.bottomLine = '<r>das hier sind lyrics';
      expected.lyrics.topLine = '    C';

      const resLine = parser.getLine(
        '<r>das [C]hier sind lyrics | eine tolle bla | noch <b>was anderes; tooooolllles | oder so'
      );

      expect(resLine.annotations).toEqual(expected.annotations);
      expect(resLine.annotationCells).toBe(expected.annotationCells);
      expect(resLine.differentAnnotations).toBe(expected.differentAnnotations);
      expect(resLine.lyrics).toEqual(expected.lyrics);
      expect(resLine.lyricsWidth).toEqual(expected.lyrics.bottomLine.length - 3);
    });
  });

  describe('processAnnotations()', () => {
    it('should process annotations correctly (split cells, split multiple states)', () => {
      const parser = TestBed.get(ParserService);
      const expected = new Line();
      expected.annotations = [['eine tolle bla'], ['noch was anderes', 'tooooolllles'], ['oder so']];
      expected.annotationCells = 3;
      expected.differentAnnotations = 2;
      const expectedRes = 'das hier sind lyrics';
      const resLine = new Line();

      const res = parser.processAnnotations('das hier sind lyrics | eine tolle bla | noch was anderes; tooooolllles | oder so', resLine);

      expect(resLine.annotations).toEqual(expected.annotations);
      expect(resLine.annotationCells).toBe(expected.annotationCells);
      expect(resLine.differentAnnotations).toBe(expected.differentAnnotations);
      expect(res).toBe(expectedRes);
    });

    it('also for formatted lines', () => {
      const parser = TestBed.get(ParserService);
      const expected = new Line();
      expected.annotations = [['<r>eine tolle bla'], ['noch was a**nderes', 'tooooolllles'], ['oder so']];
      expected.annotationCells = 3;
      expected.differentAnnotations = 2;
      const expectedRes = 'das <g>hier [C]sind lyrics';
      const resLine = new Line();

      const res = parser.processAnnotations(
        'das <g>hier [C]sind lyrics | <r>eine tolle bla | noch was a**nderes ; tooooolllles | oder so',
        resLine
      );

      expect(resLine.annotations).toEqual(expected.annotations);
      expect(resLine.annotationCells).toBe(expected.annotationCells);
      expect(resLine.differentAnnotations).toBe(expected.differentAnnotations);
      expect(res).toBe(expectedRes);
    });
  });

  describe('processChords()', () => {
    it('should split chords and lyrics correctly', () => {
      const parser = TestBed.get(ParserService);
      let expectedTop =    ' C  D  E  F';
      let expectedBottom = 'eine alte dampflock';
      let str = 'e[C]ine[D] al[E]te [F]dampflock';

      let res = parser.getLine(str);
      expect(res.lyrics.topLine).toBe(expectedTop);
      expect(res.lyrics.bottomLine).toBe(expectedBottom);
      expect(res.lyricsWidth).toBe(expectedBottom.length);

      expectedTop =    'C  D  E             F';
      expectedBottom = 'eine alte dampflock';
      str = '[C]ein[D]e a[E]lte dampflock [F]';

      res = parser.getLine(str);
      expect(res.lyrics.topLine).toBe(expectedTop);
      expect(res.lyrics.bottomLine).toBe(expectedBottom);
      expect(res.lyricsWidth).toBe(expectedTop.length);

      expectedTop =    'C  D  E           Am F';
      expectedBottom = 'eine alte dampflock';
      str = '[C]ein[D]e a[E]lte dampfloc[Am]k [F]';

      res = parser.getLine(str);
      expect(res.lyrics.topLine).toBe(expectedTop);
      expect(res.lyrics.bottomLine).toBe(expectedBottom);
      expect(res.lyricsWidth).toBe(expectedTop.length);
    });

    it('should get correct length with formatting', () => {
      const parser = TestBed.get(ParserService);
      let expectedTop =    ' <r>C  D  E  F';
      let expectedBottom = '**eine alte da**mpflock';
      let str = '**e[<r>C]ine[D] al[E]te [F]da**mpflock';

      let res = parser.getLine(str);
      expect(res.lyrics.topLine).toBe(expectedTop);
      expect(res.lyrics.bottomLine).toBe(expectedBottom);
      expect(res.lyricsWidth).toBe(expectedBottom.length - 4);

      expectedTop =    'C  ***D  E             <g>F';
      expectedBottom = 'ei<r>ne alte dampflock';
      str = '[C]ei<r>n[***D]e a[E]lte dampflock [<g>F]';

      res = parser.getLine(str);
      expect(res.lyrics.topLine).toBe(expectedTop);
      expect(res.lyrics.bottomLine).toBe(expectedBottom);
      expect(res.lyricsWidth).toBe(expectedTop.length - 6);
    });
  });

  describe('max()', () => {
    it('should return correct max if one is undefined', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.max(undefined, 8)).toBe(8);
      expect(parser.max(8, undefined)).toBe(8);
    });

    it('should return correct max', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.max(4, 8)).toBe(8);
      expect(parser.max(8, -1)).toBe(8);
    });
  });

  describe('metaToString()', () => {
    const song = {
      'title': 'Privileg F-CAMP',
      'transposedBy': 0,
      'blocks': [],
      'order': [
        'intro',
        'strophe 1',
        'refrain'
      ],
      'artist': 'Samuel Harfst'
    };

    it('should parse all meta data to a correct string (only title)', () => {
      const parser = TestBed.get(ParserService);
      const songCopy = Object.assign({}, song);
      songCopy.artist = '';
      songCopy.order = [];
      expect(parser.metaToString(songCopy)).toBe('[title: Privileg F-CAMP]\n\n');
    });

    it('should parse all meta data to a correct string (only artist)', () => {
      const parser = TestBed.get(ParserService);
      const songCopy = Object.assign({}, song);
      songCopy.title = '';
      songCopy.order = [];
      expect(parser.metaToString(songCopy)).toBe('[artist: Samuel Harfst]\n\n');
    });

    it('should parse all meta data to a correct string (only bpm)', () => {
      const parser = TestBed.get(ParserService);
      const songCopy = Object.assign({}, song);
      songCopy.title = '';
      songCopy.artist = '';
      songCopy['bpm'] = 1;
      songCopy.order = [];
      expect(parser.metaToString(songCopy)).toBe('[bpm: 1]\n\n');
    });

    it('should parse all meta data to a correct string (only books)', () => {
      const parser = TestBed.get(ParserService);
      const songCopy = Object.assign({}, song);
      songCopy.title = '';
      songCopy.artist = '';
      songCopy.order = [];
      songCopy['books'] = ['buch 1', 'buch 2'];
      expect(parser.metaToString(songCopy)).toBe('[books: buch 1, buch 2]\n\n');
    });

    it('should parse all meta data to a correct string', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.metaToString(song)).toBe('[title: Privileg F-CAMP; artist: Samuel Harfst]\n\n[order: intro, strophe 1, refrain]\n\n');

      song['bpm'] = 1;
      song['books'] = ['buch 1', 'buch 2'];
      expect(parser.metaToString(song)).toBe(`[title: Privileg F-CAMP; artist: Samuel Harfst; bpm: 1; books: buch 1, buch 2]

[order: intro, strophe 1, refrain]\n\n`);
    });
  });

  describe('blockToString()', () => {
    const block = {
      'title': 'intro',
      'lines': [
        {
          'lyrics': {
            'topLine':    ' Am F Am G',
            'bottomLine': '            2x'
          },
          'annotations': [['nils, jakob, jannes klimpern'], [ 'zweite zeile', 'blub']]
        },
        {
          'lyrics': {
            'topLine':    ' Am F Am G',
            'bottomLine': '            2x'
          },
          'annotations': [['nils, jakob, jannes klimpern'], [ 'zweite zeile', 'blub']]
        }
      ]
    };

    it('should create a correct string of a given block', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.blockToString(block))
        .toBe(`[block: intro]\n [Am] [F] [Am] [G]   2x | nils, jakob, jannes klimpern| zweite zeile; blub
 [Am] [F] [Am] [G]   2x | nils, jakob, jannes klimpern| zweite zeile; blub\n`);
      expect(parser.blockToString({title: 'test', lines: []})).toBe('[block: test]\n');
    });
  });

  describe('joinTopAndBottomLine()', () => {
    const line = new Line();
    it('merge top line and bottom line as expected', () => {
      const parser = TestBed.get(ParserService);

      line.lyrics.topLine =    '  C  Am D/F#  G      F';
      line.lyrics.bottomLine = '123<r>456789012*345*67890';
      let expected = '12[C]3<r>45[Am]678[D/F#]9012*34[G]5*67890 [F]';
      expect(parser.joinTopAndBottomLine(line)).toEqual(expected);

      line.lyrics.topLine =    'C  ';
      line.lyrics.bottomLine = '<r>4';
      expected = '[C]<r>4';
      expect(parser.joinTopAndBottomLine(line)).toEqual(expected);

      line.lyrics.topLine =    ' C  ';
      line.lyrics.bottomLine = '<r>***4';
      expected = '<r>***4[C]';
      expect(parser.joinTopAndBottomLine(line)).toEqual(expected);
    });
  });

  describe('joinAnnotations()', () => {
    const line = new Line();
    it('multilple annotations should be joined correctly', () => {
      const parser = TestBed.get(ParserService);
      line.annotations = [['  an annotation '], ['is', 'quite', 'nice']];
      expect(parser.joinAnnotations(line)).toEqual(' |   an annotation | is; quite; nice');
    });

    it('no annotations should result in an empty string', () => {
      const parser = TestBed.get(ParserService);
      line.annotations = [];
      expect(parser.joinAnnotations(line)).toEqual('');
    });
  });

  describe('getPlainLine()', () => {
    it('should return a string without no formatting commands nor chords', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.getPlainLine('asdf<r>asdfl***köjy<G>asd[f]ölkj** *  asf<b>as[d]f')).toBe('asdfasdflköjyasdölkj asfasf');
    });
  });

  describe('countRegexChars()', () => {
    it('should return the amount of chars of formatting commands', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf<r>asdfl***köjy<G>asdfölkj** * a[d]sf<b>asdf')).toBe(15);
      expect(parser.countRegexChars('asdf**')).toBe(2);
      expect(parser.countRegexChars('*asdf')).toBe(1);
      expect(parser.countRegexChars('asdf<r>')).toBe(3);
      expect(parser.countRegexChars('<r>asdf')).toBe(3);
    });

    it('should return the amount of chars starting from the 9th char', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf<r>asdfl***köjy<G>asdfölkj** * a[d]sf<b>asdf', 9)).toBe(3);
    });

    it('should return 0 if there are no special chars', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf')).toBe(0);
      expect(parser.countRegexChars('')).toBe(0);
    });

    it('should include all specialchars if end is surrounded by special chars', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('<r>***a', 1)).toBe(6);
      expect(parser.countRegexChars('<r>***a', 0)).toBe(0);
      expect(parser.countRegexChars('<r>***a', 4)).toBe(6);
    });
  });
});
