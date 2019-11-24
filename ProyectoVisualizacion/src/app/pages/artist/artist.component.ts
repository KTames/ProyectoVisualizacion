import { Component, OnInit, HostListener } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {
  
  private artists = [];
  searchText: string = "";

  constructor(private nodeService: NodeService) { }

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
  getData() {
    document.getElementsByClassName("svg")[0].innerHTML = "";
    if (this.searchText == "")
      return
    this.nodeService.getSongs(this.searchText)
      .subscribe((response) => {

        const array = [];
        for (let i = 0; i <= response.length; i++) {

          if (response[i] != undefined)

            array.push({
              popularidad: response[i].popularity,
              artistas: response[i].artists
            });

        }
      })
  }

}
