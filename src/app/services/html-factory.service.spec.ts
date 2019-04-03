import { TestBed } from '@angular/core/testing';
import { GrammarParser } from './grammar-parser.service';
import { HtmlFactoryService } from './html-factory.service';

describe('UNIT tests HtmlFactoryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HtmlFactoryService,
        GrammarParser
      ]
    });
  });

  describe('highlightText()', () => {
    it('should return correct html', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const input = `<r>**ein string | mit <r> styled annotations | oder so\nund eine zeile ohne`;
      const expected = [
        '<pre class="line-wrapper"><pre></pre><pre class="red">&lt;r&gt;</pre><pre class="red bold">**ein string ' +
        '</pre><pre>|</pre><pre> mit </pre><pre class="red">&lt;r&gt; styled annotations </pre><pre>|</pre><pre> oder so</pre></pre>',
        `<pre class="line-wrapper"><pre>und eine zeile ohne</pre></pre>`
      ];
      expect(htmlFactory.highlightText(input)).toEqual(expected);
    });
  });

  describe('songToHTML()', () => {
    it('should return an empty string if there is no song', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      expect(htmlFactory.songToHTML()).toBe('');
    });

    it('should return correct meta data', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: 'title',
        artist: 'künst ler',
        bpm: 10,
        books: ['buch 1']
      };
      const expectedHtml = `
    <div class="page">
      <div class="title">
        <h1>title</h1>
        <div class="artist">künst ler</div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        10
      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul><li>buch 1</li></ul></div>`;

      const res = htmlFactory.songToHTML(song);
      expect(res.startsWith(expectedHtml)).toBe(true);
    });

    it('should return correct meta data (only title)', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: 'title',
        artist: '',
        bpm: undefined,
        books: undefined
      };
      const expectedHtml = `
    <div class="page">
      <div class="title">
        <h1>title</h1>
        <div class="artist"></div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        \n      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul></ul></div>`;

      const res = htmlFactory.songToHTML(song);
      expect(res.startsWith(expectedHtml)).toBe(true);
    });

    it('should return correct meta data (only artist)', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: 'künst ler',
        bpm: undefined,
        books: undefined
      };
      const expectedHtml = `
    <div class="page">
      <div class="title">
        <h1></h1>
        <div class="artist">künst ler</div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        \n      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul></ul></div>`;

      const res = htmlFactory.songToHTML(song);
      expect(res.startsWith(expectedHtml)).toBe(true);
    });

    it('should return correct meta data (only bpm)', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: '',
        bpm: 10,
        books: undefined
      };
      const expectedHtml = `
    <div class="page">
      <div class="title">
        <h1></h1>
        <div class="artist"></div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        10\n      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul></ul></div>`;

      const res = htmlFactory.songToHTML(song);
      expect(res.startsWith(expectedHtml)).toBe(true);
    });

    it('should return correct meta data (only books)', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: '',
        bpm: undefined,
        books: ['buch 1', 'buch2']
      };
      const expectedHtml = `
    <div class="page">
      <div class="title">
        <h1></h1>
        <div class="artist"></div>
      </div>
      <div class="bpm">
        <div class="bpm_img"></div>
        \n      </div>
      <div class="books">
        <div class="books_img"></div>
        <ul><li>buch 1</li><li>buch2</li></ul></div>`;

      const res = htmlFactory.songToHTML(song);
      expect(res.startsWith(expectedHtml)).toBe(true);
    });

    it('should return correct block html without order', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: '',
        bpm: undefined,
        books: undefined,
        blocks: [{
          'maxLineWidth': 4,
          'title': 'Intro',
          'lines': [
            {
              'lyrics': {
                'topLine': ' D',
                'bottomLine': ' <r>text'
              },
              'annotations': [['Finna, Flip'], ['', '2nd printed']],
              'differentAnnotations': 2,
              'annotationCells': 1,
              'printed': 0,
              'lyricsWidth': 1
            }
          ],
          'maxDiffAnnotationsPerRepition': 1,
          'annotationCells': 1
        }],
        maxLineWidth: 4,
        annotationCells: 2
      };

      const res = htmlFactory.songToHTML(song);
      expect(res).toContain(`<div class="block">
      <h4>Intro</h4>
      <table class="block_table"><tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> D</pre></pre>
        </td>
        <td class="annotation_border"></td><td class="annotation_border"></td>
      </tr>
      <tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> </pre><pre class="red">text</pre></pre>
        </td><td class="annotation_border"><pre> <pre>Finna, Flip</pre></pre></td><td class="annotation_border"></td></tr></table></div>`);
    });

    it('should return correct block html with order', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: '',
        bpm: undefined,
        books: undefined,
        blocks: [{
          'maxLineWidth': 4,
          'title': 'Intro',
          'lines': [
            {
              'lyrics': {
                'topLine': ' D',
                'bottomLine': ' <r>text'
              },
              'annotations': [['Finna, Flip'], ['', '2nd printed']],
              'differentAnnotations': 2,
              'annotationCells': 1,
              'printed': 0,
              'lyricsWidth': 1
            }
          ],
          'maxDiffAnnotationsPerRepition': 1,
          'annotationCells': 1
        }],
        order: ['Intro', 'Intro'],
        maxLineWidth: 4,
        annotationCells: 2
      };

      const res = htmlFactory.songToHTML(song);
      expect(res).toContain(`<div class="block">
      <h4>Intro</h4>
      <table class="block_table"><tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> D</pre></pre>
        </td>
        <td class="annotation_border"></td><td class="annotation_border"></td>
      </tr>
      <tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> </pre><pre class="red">text</pre></pre>
        </td><td class="annotation_border"><pre> <pre>Finna, Flip</pre></pre></td>${ ''
        }<td class="annotation_border"></td></tr></table></div><div class="block">
      <h4>Intro</h4>
      <table class="block_table"><tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> D</pre></pre>
        </td>
        <td class="annotation_border"></td><td class="annotation_border"></td>
      </tr>
      <tr>
        <td style="width: ${4 * 6.5}pt">
          <pre><pre> </pre><pre class="red">text</pre></pre>
        </td><td class="annotation_border"><pre> <pre>Finna, Flip</pre></pre></td>${''
      }<td class="annotation_border"><pre> <pre>2nd printed</pre></pre></td></tr></table></div>`);
    });

    it('should be stateless', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const song = {
        title: '',
        artist: '',
        bpm: undefined,
        books: undefined,
        blocks: [{
          'maxLineWidth': 4,
          'title': 'Intro',
          'lines': [
            {
              'lyrics': {
                'topLine': ' D',
                'bottomLine': ' <r>text'
              },
              'annotations': [['Finna, Flip'], ['', '2nd printed', 'test']],
              'differentAnnotations': 3,
              'annotationCells': 1,
              'printed': 0,
              'lyricsWidth': 1
            }
          ],
          'maxDiffAnnotationsPerRepition': 1,
          'annotationCells': 1
        }],
        order: ['Intro', 'Intro'],
        maxLineWidth: 4,
        annotationCells: 2
      };

      const res = htmlFactory.songToHTML(song);
      expect(htmlFactory.songToHTML(song)).toEqual(res);
      expect(htmlFactory.songToHTML(song)).toEqual(res);
      expect(htmlFactory.songToHTML(song)).toEqual(res);
    });
  });

  describe('blockToHtml()', () => {
    it('should return an empty string if there is no block', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      expect(htmlFactory.blockToHtml()).toBe('');
    });

    it('should return a correct string with n cells', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const block = {
        'maxLineWidth': 4,
        'title': 'Intro',
        'lines': [
          {
            'lyrics': {
              'topLine': ' D',
              'bottomLine': ' <r>text'
            },
            'annotations': [['Finna, Flip'], ['', '2nd printed']],
            'differentAnnotations': 2,
            'annotationCells': 1,
            'printed': 0,
            'lyricsWidth': 1
          }
        ],
        'maxDiffAnnotationsPerRepition': 1,
        'annotationCells': 1
      };

      const expected = `<div class="block">
      <h4>Intro</h4>
      <table class="block_table"><tr>
        <td style="width: ${20 * 6.5}pt">
          <pre><pre> D</pre></pre>
        </td>
        <td class="annotation_border"></td><td class="annotation_border"></td>
      </tr>
      <tr>
        <td style="width: ${20 * 6.5}pt">
          <pre><pre> </pre><pre class="red">text</pre></pre>
        </td><td class="annotation_border"><pre> <pre>Finna, Flip</pre></pre></td><td class="annotation_border"></td></tr></table></div>`;

      const expected2 = `<div class="block">
      <h4>Intro</h4>
      <table class="block_table"><tr>
        <td style="width: ${20 * 6.5}pt">
          <pre><pre> D</pre></pre>
        </td>
        <td class="annotation_border"></td><td class="annotation_border"></td>
      </tr>
      <tr>
        <td style="width: ${20 * 6.5}pt">
          <pre><pre> </pre><pre class="red">text</pre></pre>
        </td><td class="annotation_border"><pre> <pre>Finna, Flip</pre></pre></td>${''
      }<td class="annotation_border"><pre> <pre>2nd printed</pre></pre></td></tr></table></div>`;

      expect(htmlFactory.blockToHtml(block, 2, 20)).toEqual(expected);
      expect(htmlFactory.blockToHtml(block, 2, 20)).toEqual(expected2);
    });
  });

  describe('extendMissingCells()', () => {
    it('should create html with n cells', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      expect(htmlFactory.extendMissingCells(0, 3))
        .toBe('<td class="annotation_border"></td><td class="annotation_border"></td><td class="annotation_border"></td>');
        expect(htmlFactory.extendMissingCells(2, 3))
          .toBe('<td class="annotation_border"></td>');
    });
  });

  describe('markdown()', () => {
    it('should call GrammarParser.parse()', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      const parse = spyOn(TestBed.get(GrammarParser), 'parse');
      htmlFactory.markdown('');

      expect(parse).toHaveBeenCalledWith('', false);

      htmlFactory.markdown('test', true);
      expect(parse).toHaveBeenCalledWith('test', true);
    });
  });

  describe('styles()', () => {
    it('should return a style string', () => {
      const htmlFactory = TestBed.get(HtmlFactoryService);
      expect(htmlFactory.style()).toContain('@font-face');
      expect(htmlFactory.style()).toContain('<style>');
    });
  });
});
