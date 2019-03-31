import { ParserService } from './parser.service';
import { TestBed } from '@angular/core/testing';
import { HtmlFactoryService } from './html-factory.service';
import { GrammarParser } from './grammar-parser.service';

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

  describe('getPlainLine()', () => {
    it('should return a string without no formatting commands nor chords', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.getPlainLine('asdf<r>asdfl***köjy<G>asdfölkj** * asf<b>asdf')).toBe('asdfasdflköjyasdfölkj asfasdf');
    });
  });

  describe('countRegexChars()', () => {
    it('should return the amount of chars of formatting commands', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf<r>asdfl***köjy<G>asdfölkj** * a[d]sf<b>asdf')).toBe(15);
    });

    it('should return the amount of chars starting from the 9th char', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf<r>asdfl***köjy<G>asdfölkj** * a[d]sf<b>asdf', 9)).toBe(12);
    });

    it('should return 0 if there are no special chars', () => {
      const parser = TestBed.get(ParserService);
      expect(parser.countRegexChars('asdf')).toBe(0);
      expect(parser.countRegexChars('')).toBe(0);
    });
  });
});
