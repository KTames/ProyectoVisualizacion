import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-genre-widget',
  templateUrl: './genre-widget.component.html',
  styleUrls: ['./genre-widget.component.css']
})
export class GenreWidgetComponent implements OnInit {

  @Input() name: string;
  @Input("link") linkToBackground: string;
  
  @Input() active: boolean;
  @Output() voted = new EventEmitter<boolean>();

  constructor() {
  }

  trigger() {
    this.active = !this.active;
    this.voted.emit(this.active);
  }

  ngOnInit() { }

}
