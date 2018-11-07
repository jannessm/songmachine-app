import { Component, OnInit, HostListener, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlFactoryService } from '../../services/html-factory.service';
import { ParserService } from '../../services/parser.service';
import { Song } from '../../models/song';
import { MUSICAL_KEYS } from '../../models/keys';
import { KeyFinderService } from '../../services/keyFinder.service';

const enum KEYS {
  openBracket = 91,
  backspace = 8,
  star = 42
}

@Component({
  selector: 'app-songsheet-textarea',
  templateUrl: './songsheet-textarea.component.html',
  styleUrls: ['./songsheet-textarea.component.scss']
})
export class SongsheetTextareaComponent implements OnInit, OnChanges {

  @Input() input: Song;
  @Output() value: EventEmitter<Song> = new EventEmitter<Song>();

  @ViewChild('textfield') textfield: ElementRef;

  song: Song = new Song();
  songText: string;
  transposeSteps = 0;
  transposeStep = 0;
  inputGroup: FormGroup;
  htmlLines: string[] = [];

  start: number;
  end: number;

  constructor(
    private fb: FormBuilder,
    private htmlFactory: HtmlFactoryService,
    private parser: ParserService,
    private keyFinder: KeyFinderService
  ) {
    this.inputGroup = this.fb.group({
      'inputControl': [null]
    });
  }

  ngOnInit() {
    this.update('');
    this.inputGroup.get('inputControl').valueChanges.subscribe((v) => {
        this.update(v);
        this.songText = v;
        this.song = this.parser.stringToSong(v);
        this.value.emit(this.song);
    });
  }
  ngOnChanges() {
    if (this.input) {
      this.song = this.input;
      this.keyFinder.findKey(this.parser.songToString(this.song));
      this.inputGroup.get('inputControl').setValue(this.parser.songToString(this.song));
    }
  }

  private update(inputText: string) {
    this.htmlLines = this.htmlFactory.highlightText(inputText);
  }

  @HostListener('keypress', ['$event.keyCode', '$event.target'])
  autocomplete(keyCode, target) {
    this.start = target.selectionStart;
    this.end = target.selectionEnd;

    if (keyCode === KEYS.openBracket || keyCode === KEYS.star) {
      const text = target.value;
      const charPos = target.selectionStart;
      let insert = '';

      switch (keyCode) {
        case KEYS.openBracket:
          if (text.substr(charPos, 1) !== ']' || this.countBefore(text, '[', charPos) === this.countAfter(text, ']', charPos)) {
            insert = ']';
          }
          break;
        case KEYS.star:
          if (text.substr(charPos, 1) !== '*' || this.countBefore(text, '*', charPos) === this.countAfter(text, '*', charPos)) {
            insert = '*';
          }
          break;
      }

      target.value = text.substr(0, charPos) + insert + text.substr(charPos);
      target.selectionStart = charPos;
      target.selectionEnd = charPos;
    }
  }

  @HostListener('keydown', ['$event.keyCode', '$event.target'])
  backspace(keyCode, target) {
    if (keyCode !== KEYS.backspace) {
      return;
    }

    const text = target.value;
    const charPos = target.selectionStart;

    // if backspace was pressed delete '[' or '*' if they are doubled like and space is in between [|] or *|*
    if (target.selectionStart === target.selectionEnd) {

      let remove = 0;

      switch (text.charAt(charPos - 1)) {
        case '[':
          if (text.charAt(charPos) === ']') {
            remove = 1;
          }
          break;
        case '*':
          if (text.charAt(charPos) === '*') {
            remove = 1;
          }
          break;
      }

      target.value = text.substr(0, charPos) + text.substr(charPos + remove);
      target.selectionStart = charPos;
      target.selectionEnd = charPos;
    }
}

  private countBefore(string, symbol, selectPos) {
    let i = 0;
    for ( ; string.charAt(selectPos - i - 1) === symbol; i++) { }
    return i;
  }
  private countAfter(string, symbol, selectPos) {
    let i = 0;
    for ( ; string.charAt(selectPos + i) === symbol; i++) { }
    return i;
  }

  public transposeUp() {
    this.transposeSteps = (this.transposeSteps + 1) % 12;
    this.transposeStep = 1;
    this.transpose();
  }

  public transposeDown() {
    this.transposeSteps = (this.transposeSteps - 1) % 12;
    this.transposeStep = -1;
    this.transpose();
  }

  private transpose() {
    const res = this.keyFinder.getKeys(this.songText);
    const matches: RegExpExecArray[] = res.matches;
    const flat = res.flat;

    matches.reverse().forEach(m => {
      // if there is no extra basenote
      if (!m[2]) {
        this.songText = this.songText.substr(0, m.index) +
                        '[' + this.getNewChord(m[1], flat) + ']' +
                        this.songText.substr(m.index + m[0].length);
      } else {
        this.songText = this.songText.substr(0, m.index) +
                        '[' + this.getNewChord(m[1], flat) + '/' +
                        this.getNewChord(m[2], flat) + ']' +
                        this.songText.substr(m.index + m[0].length);
      }
    });
    this.inputGroup.get('inputControl').setValue(this.songText);
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
      const newId = (id + this.transposeStep + 12) % 12;
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

}
