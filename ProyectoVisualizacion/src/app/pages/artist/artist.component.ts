import { Component, OnInit, HostListener } from '@angular/core';
import { NodeService } from 'src/app/services/node.service';
import { ActivatedRoute } from '@angular/router';
import * as d3 from 'd3';
import * as gp from 'd3-geo-projection';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  private artists = [];
  searchText: string = "";
  name: string;
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
      // this.ShowMap();
  }

  nombre: string;
  area: string;
  type: string;
  rating: string;
  link: string;
  album: string[];
  year: string;
  year2: string;
  year3: string;

  sales: string;
  sales2: string;
  sales3: string;




  getData() {

    if (this.searchText == "")
      document.getElementsByClassName("card__table")[0].innerHTML = "";

    
    this.nodeService.getArtist(this.searchText)
      .subscribe((response: any) => {
        this.nombre = response.name
        this.area = response.area
        this.type = response.type
        this.rating = response.rating
        this.link = response.link
        this.album = response['albums']
        this.year = this.album[0]['year']
        this.year2 = this.album[1]['year']
        this.year3 = this.album[2]['year']

        this.sales = this.album[0]['releases']
        this.sales2 = this.album[1]['releases']
        this.sales3 = this.album[2]['releases']


      })

    this.ShowMap()
  }
  ShowMap(){

    
    // The svg
    var svg = d3.select(".svg")

    var country = "United States"

    // Map and projection
    var projection = gp.geoNaturalEarth()
      .scale(400 / 1.3 / Math.PI)
      .translate([400 / 2, 300 / 2])
    // Load external data and boot
    d3.json("assets/world.json").then(function(data){
      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr("fill", "#409433")
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .style("stroke", "#fff")
      // Filter data
      data.features = data.features.filter(function (d) { return d.properties.name == country})

      // Draw the map
      svg.append("g")
        .selectAll("path")
        .data(data.features)
        .enter()
        .append("path")
        .attr("fill", "#e65a00")
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .style("stroke", "none")
    })
  }
}
