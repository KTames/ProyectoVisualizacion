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
  radioMin = 20
  radioMax = 60
  sum: number = 0;
  popMin = -1
  popMax = 0


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

  getRadius(popularity, mainClass): number {
    const popFixed = popularity - mainClass.popMin;

    const porcentaje = popFixed / (mainClass.popMax - mainClass.popMin);

    return ((mainClass.radioMax - mainClass.radioMin) * porcentaje + mainClass.radioMin);
  }

  getData() {
    document.getElementsByClassName("svg")[0].innerHTML = "";
    if (this.searchText == "")
      return
    this.nodeService.getSongs(this.searchText)
      .subscribe((response) => {

        const array = [];
        for (let i = 0; i <= response.length; i++) {

          if (response[i] != undefined) {
            if (this.popMin == -1 || response[i].popularity > this.popMin)
              this.popMin = response[i].popularity;
            if (response[i].popularity < this.popMax)
              this.popMax = response[i].popularity;
            array.push({
              nombre: response[i].name,
              popularidad: response[i].popularity,
              artistas: response[i].artists,
              duracion: response[i].duration,
              imagen: response[i].image,
              tx: 0, ty: 0,      // relative to the translated center
              inGroup1: Math.random() >= 0.5  // random boolean
            });
          }

        }

        for (let item of array)
          item['r'] = this.getRadius(item['popularidad'], this);

        this.drawBubbles(array);
        this.drawProgress();

      })
  }

  drawBubbles(nodes) {

    var width = 960, height = 960;

    var color = d3.scaleOrdinal(d3.schemeBlues[9]);

    var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");


    var simulation = d3.forceSimulation<any>(nodes)
      .velocityDecay(0.4)
      .force("collide", d3.forceCollide<any>().radius(function (d) { return d.r + 5; }).iterations(2))
      .on("tick", ticked);
    simulation
      .force("x", d3.forceX(0).strength(0.009))
      .force("y", d3.forceY(0).strength(0.009));
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
      .attr('r', function (d) {
        return mainClass.getRadius(d.popularidad, mainClass)
      })
      .attr("fill", function (d, i) { return color(i); })
      .attr('stroke', '#333')

      .on("mouseover", function (d) {
        return tooltip.style("visibility", "visible").html("<b>" + d.nombre + "</b>");
      })
      .on("mousemove", function () { return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px"); })
      .on("mouseout", function () { return tooltip.style("visibility", "hidden"); })
      .on("click", function (d) {
        mainClass.artists = d.artistas;
        mainClass.name = d.nombre;
        mainClass.duration = d.duracion;
        mainClass.popularity = d.popularidad;
        mainClass.image = d.imagen

        mainClass.show = true;
      })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
      );

    var bubbles = d3.selectAll('.bubble');
    bubbles.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    function ticked() {
      //bubbles.each(modifyNodePosition(this.alpha())) 
      bubbles.each(function (node) { })
        .attr("cx", function (d: any) { return d.x; })
        .attr("cy", function (d: any) { return d.y; });
    }
    function dragsubject() {
      return simulation.find(d3.event.x, d3.event.y, function (d) { return d.r });
    }

    function dragstarted() {
      if (!d3.event.active) simulation.alphaTarget(1).restart();
      d3.event.subject.fx = d3.event.subject.x;
      d3.event.subject.fy = d3.event.subject.y;
    }

    function dragged() {
      d3.event.subject.fx = d3.event.x;
      d3.event.subject.fy = d3.event.y;
    }

    function dragended() {
      if (!d3.event.active) simulation.alphaTarget(0);
      d3.event.subject.fx = null;
      d3.event.subject.fy = null;
    }
  }


  drawProgress() {

    // set the dimensions and margins of the graph
    var margin = { top: 5, right: 5, bottom: 5, left: 5 },
      width = 120 - margin.left - margin.right,
      height = 120 - margin.top - margin.bottom;

    // set the ranges
    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);
    var y = d3.scaleLinear()
      .range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".svg")
      .append("g")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

      const data = [{salesperson: "Popularidad", sales: 100}]
      // Scale the range of the data in the domains
      x.domain(data.map(function (d) { return d.salesperson; }));
      y.domain([0, d3.min(data, function (d) { return d.sales; })]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) { return x(d.salesperson); })
        .attr("width", x.bandwidth())
        .attr("y", function (d) { return y(d.sales); })
        .attr("height", d3.randomUniform(20, 90));

      // add the x Axis
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
        .call(d3.axisLeft(y));

    // });
  }
}
