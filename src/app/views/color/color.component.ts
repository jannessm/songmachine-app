import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {

  colors = [
    'black',
    'dark-grey',
    'grey',
    'light-grey',
    'white',
    'pastel-yellow',
    'yellow',
    'lemon',
    'dark-yellow',
    'lavender',
    'lila',
    'dark-lila',
    'light-orange',
    'orange',
    'dark-orange',
    'pastel-blue',
    'blue',
    'dark-blue',
  ];

  constructor() { }

  ngOnInit() {
  }

}
