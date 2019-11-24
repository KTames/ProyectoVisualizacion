import { Component, OnInit, HostListener } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private artists = [];
  searchText: string = "";
  private startingDraw: boolean = false

  constructor(private nodeService: NodeService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q'] != undefined) {
        this.searchText = params['q'];
        this.startingDraw = true;
      }
    });
  }

  ngOnInit() {
    if (this.startingDraw)
      this.getData();
  }

  nombreArtista:string = ""

  getData() {
    // document.getElementsByClassName("svg")[0].innerHTML = "";
    // console.log("Obteniendo los datos de " + this.searchText);
    
    if (this.searchText == "")
      return
    this.nodeService.getSongs(this.searchText)
      .subscribe((response: any) => {
        this.nombreArtista = response.name
      })
  }

}
