import { Component, Input, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { Song } from '../../models/song';
import { HtmlFactoryService } from '../../services/html-factory.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit{

  @Input()
  preformMode:boolean = true;
  @Input()
  song: Song;

  @ViewChild('wrapper') wrapperElem;

  html:string = '';

  private zoom:number = 1;

  constructor(private htmlFactory:HtmlFactoryService, private renderer: Renderer2) {}

  ngOnInit(){
    if(!this.song)
      this.song = new Song();
    this.html = this.htmlFactory.song2html(this.song);
  }

  ngAfterViewInit(){
    const width = this.wrapperElem.nativeElement.offsetWidth * 0.8;
    this.zoom = (width / 793.733333);
    this.renderer.setStyle(this.wrapperElem.nativeElement, 'zoom', this.zoom);
  }

  ngOnChanges(){
    this.html = this.htmlFactory.song2html(this.song);
  }

}
