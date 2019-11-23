import { Component, OnInit, HostListener } from '@angular/core';
import { ɵngClassDirectiveDef__POST_R3__ } from '@angular/common';
import * as d3 from 'd3';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {

  constructor(private nodeService: NodeService) { }

  radio: number;
  text: string;
  datos: []
  searchText: string = "";

  name: string
  artists: string
  popularity: number
  duration: string
  image: string
  show: boolean = false


  ngOnInit() {

    this.getData()

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
    if(this.searchText == "")
    return 
    this.nodeService.getSongs(this.searchText)
      .subscribe((response) => {

        const array = [];
        for (let i = 0; i <= response.length; i++) {
          
          if (response[i] != undefined)
          
            array.push({
              nombre: response[i].name,
              popularidad: response[i].popularity,
              artistas: response[i].artists,
              duracion: response[i].duration,
              imagen: response[i].image,
              r: response[i].popularity / 2,
              tx: 0, ty: 0,      // relative to the translated center
              inGroup1: Math.random() >= 0.5  // random boolean
            });
          
        }

        this.drawBubbles(array);

      })
  }

  drawBubbles(nodes) {

    var width = 960, height = 960;

    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");


    var simulation = d3.forceSimulation<any>(nodes)
      .velocityDecay(0.2)
      .force("collide", d3.forceCollide<any>().radius(function (d) { return d.r + 0.9; }).iterations(2))
      .on("tick", ticked);
    simulation
      .force("x", d3.forceX(0).strength(0.006))
      .force("y", d3.forceY(0).strength(0.006));
    // Create our SVG context
    var svg = d3.select('.svg')
      .attr('width', width)
      .attr('height', height);
    const mainClass = this;
    // Add a bubble 
    svg.selectAll('.bubble')
      .data<any>(nodes, function (d) { return d.id; })
      .enter().append('circle')
      .classed('bubble', true)
      .attr('r', function (d) { return d.r })
      .attr("fill", function () {
        return "hsl(" + Math.random() * 360 + ",60%,50%)";
      })
      .attr('stroke', '#333')

      .on("mouseover", function (d) {
        return tooltip.style("visibility", "visible").html("<b>" + d.nombre + "</b>");
      })
      .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
      .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })
      .on("click", function(d) {
          mainClass.artists = d.artistas;
          mainClass.name = d.nombre;
          mainClass.duration = d.duracion;
          mainClass.popularity = d.popularidad;
          mainClass.image = d.imagen

          mainClass.show = true;
      });

    var bubbles = d3.selectAll('.bubble');
    bubbles.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    function ticked() {
      //bubbles.each(modifyNodePosition(this.alpha())) 
      bubbles.each(function (node) { })
        .attr("cx", function (d: any) { return d.x; })
        .attr("cy", function (d: any) { return d.y; });
    }
  }
}
