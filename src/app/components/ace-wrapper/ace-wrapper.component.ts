import { Component, ViewChild, Input, Output, ElementRef, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';
import { Song } from '../../models/song';
import { ParserService } from '../../services/parser.service';
import { MUSICAL_KEYS } from '../../models/keys';
import { KeyFinderService } from '../../services/keyFinder.service';

@Component({
  selector: 'app-ace-wrapper',
  templateUrl: './ace-wrapper.component.html',
  styleUrls: ['./ace-wrapper.component.scss']
})
export class AceWrapperComponent implements OnChanges {

  @ViewChild('textfield') textfield;
  @ViewChild('content', {read: ElementRef}) content: ElementRef;
  aceOptions = {
    wrap: true,
    fontSize: 12,
    showPrintMargin: false
  };

  songHasChanged = false;
  mode = Mode;

  @Input() song: Song;
  @Output() songChange = new EventEmitter<Song>();

  constructor(
    private parserService: ParserService,
    private keyFinder: KeyFinderService
  ) { }

  ngOnChanges() {
    if (this.song && !this.song.text) {
      this.song.text = this.parserService.songToString(this.song);
    }
  }

  emitSongChangeEvent() {
    this.song = this.parserService.stringToSong(this.song.text);
    this.songChange.emit(this.song);
    this.songHasChanged = true;
  }

  public transposeUp() {
    this.song.transposedBy = (this.song.transposedBy + 1) % 12;
    this.song.transposedBy = 1;
    this.transpose();
  }

  public transposeDown() {
    this.song.transposedBy = (this.song.transposedBy - 1) % 12;
    this.song.transposedBy = -1;
    this.transpose();
  }

  private transpose() {
    const res = this.keyFinder.getKeys(this.song.text);
    const matches: RegExpExecArray[] = res.matches;
    const flat = res.flat;

    matches.reverse().forEach(m => {
      // if there is no extra basenote
      if (!m[2]) {
        this.song.text = this.song.text.substr(0, m.index) +
                        '[' + this.getNewChord(m[1], flat) + ']' +
                        this.song.text.substr(m.index + m[0].length);
      } else {
        this.song.text = this.song.text.substr(0, m.index) +
                        '[' + this.getNewChord(m[1], flat) + '/' +
                        this.getNewChord(m[2], flat) + ']' +
                        this.song.text.substr(m.index + m[0].length);
      }
    });
  }

  private getNewChord(chord, flat) {
    let mainKey = chord[0].toLowerCase();
    let firstTwo = false;
    if (chord[1] && (chord[1].toLowerCase() === '#' || chord[1].toLowerCase() === 'b')) {
      mainKey += chord[1].toLowerCase();
      firstTwo = true;
    }

    let id = -1;
    if (flat) {
      id = MUSICAL_KEYS.flats.findIndex(val => val.toLowerCase() === mainKey);
    } else {
      id = MUSICAL_KEYS.sharps.findIndex(val => val.toLowerCase() === mainKey);
    }

    if (id > -1) {
      let newMainKey;
      const newId = (id + this.song.transposedBy + 12) % 12;
      if (flat) {
        newMainKey = MUSICAL_KEYS.flats[newId];
      } else {
        newMainKey = MUSICAL_KEYS.sharps[newId];
      }

      if (firstTwo) {
        chord = newMainKey + chord.substr(2);
      } else {
        chord = newMainKey + chord.substr(1);
      }
    }
    return chord;
  }

  public getStepsString() {
    let str = this.song.transposedBy > 0 ? '+' : '';
    str = this.song.transposedBy < 0 ? '-' : '';
    str += this.song.transposedBy > 9 || this.song.transposedBy < -9 ? '' : ' ';
    str += this.song.transposedBy < 0 ? this.song.transposedBy * -1 : this.song.transposedBy;
    return str;
  }

}

const Mode = function() {
  // set everything up
  this.HighlightRules = SongmachineHighlightRules;
};

const SongmachineHighlightRules = function() {

  this.getRules = () => this.$rules;

  this.highlightStates = {
    color: '',
    italic: false,
    bold: false,
    resetColor: false,
    resetItalic: false,
    resetBold: false
  };

  this.resetStates = function() {
    this.highlightStates = {
      color: '',
      italic: false,
      bold: false,
      resetColor: false,
      resetItalic: false,
      resetBold: false
    };
  }
    
  this.getClasses = function() {
    let italic = this.highlightStates.italic ? "italic" : "";
    let bold = this.highlightStates.bold ? 'bold' : "";

    const color = (!!this.highlightStates.color || !!italic || !!bold) ? this.highlightStates.color : 'text';
    if (this.highlightStates.resetColor) {
      this.highlightStates.color = '';
    }
    if (this.highlightStates.resetItalic) {
      this.highlightStates.italic = false;
    }
    if (this.highlightStates.resetBold) {
      this.highlightStates.bold = false;
    }
    return [color, italic, bold].filter(val => !!val).join('_');
  };

  this.setColor = function(color) {
    if (this.highlightStates.color === color) {
      this.highlightStates.resetColor = true;
    } else {
      this.highlightStates.color = color;
    }
  };

  this.$rules = {
    'start' : [
        {token : 'br_block', regex : /(\[)(?=[^\]]*?:.*\])/, next: 'br_block'},
        {token : 'chord_start', regex : /(\[)(?![^\]]*?:)(?=[^\]]*\])/, next: 'chord'},
        // colors
        {token : () => {
            this.setColor('red');
            return this.getClasses();
        }, regex : /<r>[^\|\[]*?/},
        {token : () => {
            this.setColor('green');
            return this.getClasses();
        }, regex : /<g>[^\|\[]*?/},
        {token : () => {
            this.setColor('blue');
            return this.getClasses();
        }, regex : /<b>[^\|\[]*?/},

        {token : () => {
          if (this.highlightStates.italic) {
            this.highlightedStates.resetItalic = true;
          } else {
            this.highlightStates.italic = true;
          }
          return this.getClasses();
        }, regex : /\*(?!\*)/},
        {token : () => {
          if (this.highlightStates.bold) {
            this.highlightedStates.resetBold = true;
          } else {
            this.highlightStates.bold = true;
          }
          return this.getClasses();
        }, regex : /\*\*(?!\*)/},
        {token : () => {
          if (this.highlightStates.italic) {
            this.highlightedStates.resetItalic = true;
          } else {
            this.highlightStates.italic = true;
          }
          if (this.highlightStates.bold) {
            this.highlightedStates.resetBold = true;
          } else {
            this.highlightStates.bold = true;
          }
          return this.getClasses();
        }, regex : /\*\*\*(?!\*)/},
        {token: () => {
            return this.getClasses();
        }, regex: /[^\|]/},
        {token : () => {this.resetStates(); return 'text'; }, regex : /$/},
        {token : () => {this.resetStates(); return 'text'; }, regex : '|', next: 'annotations'},
        {defaultToken : 'text'},
        {caseInsensitive: true}
    ],
    'br_block': [
        {token: 'br_block', regex: /[^:]/},
        {token: 'br_block', regex: /:/, next: 'br'},
        {token: 'value', regex: /./},
    ],
    'br': [
        {token: 'br', regex: /[^;\]]/},
        {token: 'br_block', regex: /;/, next: 'br_block'},
        {token: 'br_block', regex: ']', next: 'start'},
    ],
    'chord': [
        {token: 'chord_start', regex: ']', next: 'start'},
        {token: 'chord', regex : /[^\]]/},
    ],
    'annotations': [
      // colors
      {token : () => {
        this.setColor('red');
        return this.getClasses();
      }, regex : /<r>[^\|;]*?/},
      {token : () => {
        this.setColor('green');
        return this.getClasses();
      }, regex : /<g>[^\|;]*?/},
      {token : () => {
        this.setColor('blue');
        return this.getClasses();
      }, regex : /<b>[^\|;]*?/},

      {token : () => {
        if (this.highlightStates.italic) {
          this.highlightedStates.resetItalic = true;
        } else {
          this.highlightStates.italic = true;
        }
        return this.getClasses();
      }, regex : /\*(?!\*)/},
      {token : () => {
        if (this.highlightStates.bold) {
          this.highlightedStates.resetBold = true;
        } else {
          this.highlightStates.bold = true;
        }
        return this.getClasses();
      }, regex : /\*\*(?!\*)/},
      {token : () => {
        if (this.highlightStates.italic) {
          this.highlightedStates.resetItalic = true;
        } else {
          this.highlightStates.italic = true;
        }
        if (this.highlightStates.bold) {
          this.highlightedStates.resetBold = true;
        } else {
          this.highlightStates.bold = true;
        }
        return this.getClasses();
      }, regex : /\*\*\*(?!\*)/},
      {token: () => {
        return this.getClasses();
      }, regex: /[^\|;]/},
      {token : () => {this.resetStates(); return 'text'; }, regex : /$/, next: 'start'},
      {token : () => {this.resetStates(); return 'text'; }, regex : /;|\|/},
      {defaultToken : 'text'},
      {caseInsensitive: true}
    ]
  };
};
