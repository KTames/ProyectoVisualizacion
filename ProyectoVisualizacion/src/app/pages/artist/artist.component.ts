import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  
  private artists = [];

  constructor() { }

  ngOnInit() {
  }

  private maxHeight: number;
  ngAfterContentInit() {
    this.maxHeight = window.innerHeight - document.getElementById('searchDiv').getBoundingClientRect().top - 20;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.maxHeight = window.innerHeight - document.getElementById('searchDiv').getBoundingClientRect().top - 20;
  }

}
