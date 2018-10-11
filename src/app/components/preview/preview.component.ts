import { Component, Input, OnInit, ViewChild, Renderer2, AfterViewInit, OnChanges, HostListener } from '@angular/core';
import { Song } from '../../models/song';
import { HtmlFactoryService } from '../../services/html-factory.service';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input()
  preformMode = true;
  @Input()
  song: Song;

  @ViewChild('wrapper') wrapperElem;

  html = '';

  private zoom = 1;

  @HostListener('window:keyup', ['$event', '$event.keyCode'])
  scroll(e, code) {
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

  constructor(private htmlFactory: HtmlFactoryService, private renderer: Renderer2) {}

  ngOnInit() {
    if (!this.song) {
      this.song = new Song();
    }
    this.html = this.htmlFactory.song2html(this.song);
  }

  ngAfterViewInit() {
    const width = this.wrapperElem.nativeElement.offsetWidth * 0.8;
    this.zoom = (width / 793.733333);
    this.renderer.setStyle(this.wrapperElem.nativeElement, 'zoom', this.zoom);
  }

  ngOnChanges() {
    this.html = this.htmlFactory.song2html(this.song);
  }

  scrollUp() {
    const height = this.wrapperElem.nativeElement.offsetHeight * 0.75;
    this.wrapperElem.nativeElement.scrollBy({top: -height, behavior: 'smooth'});
  }

  scrollDown() {
    const height = this.wrapperElem.nativeElement.offsetHeight * 0.75;
    this.wrapperElem.nativeElement.scrollBy({top: height, behavior: 'smooth'});
  }
}
