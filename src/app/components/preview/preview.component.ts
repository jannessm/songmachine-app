import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Renderer2,
  AfterViewInit,
  HostListener,
  EventEmitter,
  Output } from '@angular/core';
import { Song } from '../../models/song';
import { HtmlFactoryService } from '../../services/html-factory.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit {

  @Input()
  performMode: boolean;
  @Input()
  songInput: Observable<Song>;
  @Input()
  scrollIsActive: boolean;

  @Output() scrolledToTop = new EventEmitter<void>();
  @Output() scrolledToBottom = new EventEmitter<void>();

  @ViewChild('wrapper') wrapperElem;

  html = '';

  private zoom = 1;

  @HostListener('window:keyup', ['$event', '$event.keyCode'])
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

  constructor(private htmlFactory: HtmlFactoryService, private renderer: Renderer2) {}

  ngOnInit() {
    this.songInput.subscribe(song => this.html = this.htmlFactory.song2html(song));
  }

  ngAfterViewInit() {
    const width = this.wrapperElem.nativeElement.offsetWidth * 0.8;
    this.zoom = (width / 793.733333);
    this.renderer.setStyle(this.wrapperElem.nativeElement, 'zoom', this.zoom);
  }

  scrollUp() {
    const nativeElem = this.wrapperElem.nativeElement;
    if (nativeElem.scrollTop === 0) {
      this.scrolledToTop.emit();
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      const height = nativeElem.offsetHeight * 0.75;
      nativeElem.scrollBy({top: -height, behavior: 'smooth'});
    }
  }

  scrollDown() {
    const nativeElem = this.wrapperElem.nativeElement;
    if (nativeElem.scrollTop >=
      nativeElem.scrollHeight - nativeElem.offsetHeight) {
      this.scrolledToBottom.emit();
      nativeElem.scroll({top: 0, behavior: 'smooth'});
    } else {
      const height = nativeElem.offsetHeight * 0.75;
      nativeElem.scrollBy({top: height, behavior: 'smooth'});
    }
  }
}
