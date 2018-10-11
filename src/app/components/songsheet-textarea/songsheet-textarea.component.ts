import { Component, OnInit, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HtmlFactoryService } from '../../services/html-factory.service';
import { ParserService } from '../../services/parser.service';
import { Song } from '../../models/song';

const enum KEYS{
  openBracket = 91,
  backspace = 8,
  star = 42
}

@Component({
  selector: 'app-songsheet-textarea',
  templateUrl: './songsheet-textarea.component.html',
  styleUrls: ['./songsheet-textarea.component.scss']
})
export class SongsheetTextareaComponent implements OnInit {

  @Output() value: EventEmitter<Song> = new EventEmitter<Song>();

  inputGroup: FormGroup;
  htmlLines:string[] = [];

  constructor(
    private fb: FormBuilder, 
    private htmlFactory: HtmlFactoryService, 
    private parser: ParserService
  ) {
    this.inputGroup = this.fb.group({
      'inputControl': [null]
    });
  }

  ngOnInit() {
    this.inputGroup.get('inputControl').valueChanges.subscribe((v) => {
      this._update(v);
      this.value.emit(this.parser.str2Obj(v));
    });
    this._update('');
  }

  private _update(inputText:string){
    this.htmlLines = this.htmlFactory.highlightText(inputText);
  }

  @HostListener('keypress', ['$event.keyCode', '$event.target'])
  autocomplete(keyCode, target){
    if(keyCode === KEYS.openBracket || keyCode === KEYS.star){
      let text = target.value;
      let char_pos = target.selectionStart;
      let insert = '';
    
      switch(keyCode){
        case KEYS.openBracket:
          if (text.substr(char_pos,1) !== ']' || this._count_before(text, '[', char_pos) === this._count_after(text, ']', char_pos))
            insert = ']';
          break;
        case KEYS.star:
          if (text.substr(char_pos,1) !== '*' || this._count_before(text, '*', char_pos) === this._count_after(text, '*', char_pos))
            insert = '*';
          break;
      }
    
      target.value = text.substr(0, char_pos) + insert + text.substr(char_pos);
      target.selectionStart = char_pos;
      target.selectionEnd = char_pos;
    }
  }

  @HostListener('keydown', ['$event.keyCode', '$event.target'])
  backspace(keyCode, target){
    if(keyCode !== KEYS.backspace){
      return;
    }

    let text = target.value;
    let char_pos = target.selectionStart;

    // if backspace was pressed delete '[' or '*' if they are doubled like and space is in between [|] or *|*
    if (target.selectionStart === target.selectionEnd){

      let remove = 0;

      switch(text.charAt(char_pos - 1)){
        case '[':
          if (text.charAt(char_pos) === ']')
            remove = 1;
          break;
        case '*':
          if (text.charAt(char_pos) === '*')
            remove = 1;
          break;
      }

      target.value = text.substr(0, char_pos) + text.substr(char_pos+remove);
      target.selectionStart = char_pos;
      target.selectionEnd = char_pos;

    // if area is selected and shall be deleted
    }
}

  private _count_before(string, symbol, select_pos){
    let i = 0;
    for( ; string.charAt(select_pos - i - 1) === symbol; i++){ }
    return i;
  }
  private _count_after(string, symbol, select_pos){
    let i = 0;
    for( ; string.charAt(select_pos + i) === symbol; i++){ }
    return i;
  }

}
