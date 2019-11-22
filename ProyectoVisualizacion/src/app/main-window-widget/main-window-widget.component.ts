import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-main-window-widget',
  templateUrl: './main-window-widget.component.html',
  styleUrls: ['./main-window-widget.component.css']
})
export class MainWindowWidgetComponent implements OnInit {

  @Input() text: string;
  @Input("link") linkToBackground: string;
  @Input("redirect") redirectLink: string;
  @Input("svg") svgLink: string;
  private bgDivStyles;

  constructor() {
  }

  ngOnInit() {
    this.bgDivStyles = { 'background-image': 'url(' + this.linkToBackground + ')'};
  }

}
