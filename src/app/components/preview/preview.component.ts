import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
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
  private zoom = 1;
  menuOpen = true;
  wasExpanded = false;
  scrollSteps: number[] = [];
  step = 0;

  @HostListener('window:keypress', ['$event', '$event.keyCode'])
  scroll(e, code) {
    if (this.performMode && this.scrollIsActive) {
      e.preventDefault();
      switch (code) {
        case 13:
        case 39:
        case 40:
          this.scrollDown();
          break;
        case 32:
        case 37:
        case 38:
          this.scrollUp();
          break;
      }
    }
  }

  constructor(
    private htmlFactory: HtmlFactoryService,
    private renderer: Renderer2,
    private scrollApiService: ScrollApiService
  ) {}

  ngOnInit() {
    this.song = this.song || new Song();

    this.html = this.htmlFactory.songToHTML(this.song);
  }

  ngAfterViewInit() {
    const width = this.wrapperElem.nativeElement.offsetWidth * 0.95;
    this.zoom = (width / 793.733333);
    this.renderer.setStyle(this.wrapperElem.nativeElement, 'zoom', this.zoom);

    let scrollTop = 0;
    const nativeElem = this.wrapperElem.nativeElement;
    const scrollHeight = nativeElem.scrollHeight;
    const scrollStep = Math.floor(nativeElem.clientHeight * 75) / 100 / scrollHeight;

    while (scrollTop < 1) {
      this.scrollSteps.push(scrollTop);
      scrollTop += scrollStep;
    }
  }

  ngOnChanges() {
    this.html = this.htmlFactory.songToHTML(this.song);
  }

  scrollUp() {
    const nativeElem = this.wrapperElem.nativeElement;
    if (this.step <= 0) {
      this.step = 0;
      this.scrolledToTop.emit();
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      this.step--;
      nativeElem.scrollTo(0, this.scrollSteps[this.step] * nativeElem.scrollHeight);
    }
    this.scrollApiService.scroll(this.scrollSteps[this.step]);
  }

  scrollDown() {
    const nativeElem = this.wrapperElem.nativeElement;
    if (this.step === this.scrollSteps.length - 1) {
      this.step = 0;
      this.scrolledToBottom.emit();
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      this.step++;
      nativeElem.scrollTo(0, this.scrollSteps[this.step] * nativeElem.scrollHeight);
    }
    this.scrollApiService.scroll(this.scrollSteps[this.step]);
  }
}
