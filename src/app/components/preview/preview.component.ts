import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnChanges,
  HostListener,
  EventEmitter,
  Output } from '@angular/core';
import { Song } from '../../models/song';
import { HtmlFactoryService } from '../../services/html-factory.service';
import { ScrollApiService } from '../../services/scroll-api.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  performMode: boolean;
  @Input()
  song: Song;
  @Input()
  scrollIsActive: boolean;

  @Output() scrolledToTop = new EventEmitter<void>();
  @Output() scrolledToBottom = new EventEmitter<void>();

  @ViewChild('wrapper') wrapperElem;

  html = '';
  menuOpen = true;
  wasExpanded = false;
  scrollSteps: number[] = [];
  scrollStep: number;

  @HostListener('window:keypress', ['$event', '$event.keyCode'])
  scroll(e, code) {
    if (this.performMode && this.scrollIsActive) {
      console.log(code);
      e.preventDefault();
      switch (code) {
        case 13:
        case 34:
        case 39:
        case 40:
          this.scrollDown();
          break;
        case 32:
        case 33:
        case 37:
        case 38:
          this.scrollUp();
          break;
      }
    }
  }

  constructor(
    private htmlFactory: HtmlFactoryService,
    private scrollApiService: ScrollApiService
  ) {}

  ngOnInit() {
    this.song = this.song || new Song();
    this.html = this.htmlFactory.songToHTML(this.song);
  }

  ngAfterViewInit() {
    const nativeElem = this.wrapperElem.nativeElement;
    const scrollHeight = nativeElem.scrollHeight;
    this.scrollStep = Math.floor(nativeElem.clientHeight * 75) / 100 / scrollHeight;
  }

  ngOnChanges() {
    this.html = this.htmlFactory.songToHTML(this.song);
  }

  scrollUp() {
    const nativeElem = this.wrapperElem.nativeElement;
    let scrollTop;

    if (nativeElem.scrollTop <= 0) {
      scrollTop = 0;
      this.scrolledToTop.emit();
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      scrollTop = nativeElem.scrollTop - this.scrollStep * nativeElem.scrollHeight;
      nativeElem.scrollTo(0, scrollTop);
    }
    this.scrollApiService.scroll(scrollTop);
  }

  scrollDown() {
    const nativeElem = this.wrapperElem.nativeElement;
    let scrollTop;

    if (nativeElem.scrollTop === nativeElem.scrollHeight - nativeElem.clientHeight) {
      this.scrolledToBottom.emit();
      scrollTop = 0;
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      scrollTop = nativeElem.scrollTop + this.scrollStep * nativeElem.scrollHeight;
      nativeElem.scrollTo(0, scrollTop);
    }
    this.scrollApiService.scroll(scrollTop);
  }
}
