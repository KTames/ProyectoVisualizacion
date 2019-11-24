import { Component, OnInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import { NgControlStatusGroup } from '@angular/forms';
import { NodeService } from 'src/app/services/node.service';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent implements OnInit {

  private genres = [
    { name: "Rock", link: "assets/img/rock.jpg", active: true },
    { name: "Metal", link: "assets/img/metal.jpg", active: true },
    { name: "Pop", link: "assets/img/pop.webp", active: false },
    { name: "Reggaeton", link: "assets/img/reggaeton.jpg", active: false },
    { name: "Indie", link: "assets/img/indie.jpg", active: false },
    { name: "Reggae", link: "assets/img/reggae.jpg", active: false },
    { name: "Rap", link: "assets/img/rap.jpg", active: false },
    { name: "Folk", link: "assets/img/folk.jpg", active: false },
  ];

  public genresToSearch = [];

  private originalShowGenres = [];
  private showGenres = [];
  private maxHeight: number;

  constructor(private nodeService: NodeService) { }

  ngOnInit() {
    this.genres = this.genres.sort((a, b) => {
      if (a.name > b.name) {
        return 1;
      }

      if (a.name < b.name) {
        return -1;
      }

      return 0;
    });
    for (let g of this.genres) {
      this.originalShowGenres.push({ ref: g });
    }

    this.showGenres = this.originalShowGenres;
  }

  ngAfterContentInit() {
    this.maxHeight = window.innerHeight - document.getElementById('searchDiv').getBoundingClientRect().top - 20;
    this.drawSunburst();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.maxHeight = window.innerHeight - document.getElementById('searchDiv').getBoundingClientRect().top - 20;
  }

  vote($event: boolean, genre: any) {
    genre.active = $event;
    this.drawSunburst();
  }

  filterOptions($event: any) {
    const searchText: string = $event.target.value;
    if (searchText != "") {
      this.showGenres = [];
      for (const g of this.genres) {
        if (g.name.toLowerCase().startsWith(searchText.toLowerCase()))
          this.showGenres.push({ ref: g });
      }
    } else {
      this.showGenres = this.originalShowGenres;
    }
  }

  // async run(svg, partition, focusOn, formatNumber, color, arc, middleArcLine, textFits) {

  drawSunburst() {
    document.getElementById("svg").innerHTML = "";
    const width = window.innerWidth,
      height = window.innerHeight,
      maxRadius = (Math.min(width, height) / 2) - 5;

    const formatNumber = d3.format(',d');

    const x = d3.scaleLinear()
      .range([0, 2 * Math.PI])
      .clamp(true);

    const y = d3.scaleSqrt()
      .range([maxRadius * .1, maxRadius]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const partition = d3.partition();

    const arc = d3.arc()
      .startAngle(d => x(d.x0))
      .endAngle(d => x(d.x1))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));

    const middleArcLine = d => {
      const halfPi = Math.PI / 2;
      const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

      const middleAngle = (angles[1] + angles[0]) / 2;
      const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
      if (invertDirection) {
        angles.reverse();
      }

      const path = d3.path();
      path.arc(0, 0, r, angles[0], angles[1], invertDirection);
      return path.toString();
    };

    const textFits = d => {
      const CHAR_SPACE = 6;

      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;

      return d.data.nombre.length * CHAR_SPACE < perimeter;
    };

    const svg = d3.select('svg')
      // .style('width', '100vw')
      // .style('height', '100vh')
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
      .on('click', () => focusOn()); // Reset zoom on canvas click

    // const this = this;

    const run = async () => {
      const nodeService = this.nodeService;

      let root: any = {
        'nombre': 'Comparación de géneros',
        'children': []
      };
      const getGenre = function (genre) {
        return new Promise((resolve, reject) => {
          nodeService.getGenre(genre).subscribe((response) => {
            resolve(response);
          });
        });
      };

      this.genresToSearch = [];

      for (let g of this.genres) {
        if (g.active == true)
          this.genresToSearch.push(g.name.toLowerCase())
      }
      // console.log(this.genresToSearch);

      for (let genre of this.genresToSearch) {
        // console.log("Obteniendo");
        const response = await getGenre(genre);
        // console.log("Obtenido");
        root.children.push(response);
      }

      root = d3.hierarchy(root);
      root.sum(d => d.size);

      const slice = svg.selectAll('g.slice')
        .data(partition(root).descendants());

      slice.exit().remove();

      const newSlice = slice.enter()
        .append('g').attr('class', 'slice')
        // .attr('style', 'cursor: pointer')
        .on('click', d => {
          d3.event.stopPropagation();
          focusOn(d);
          // console.log(d);
          if (d.data.link != undefined) {
            window.location.href = "/artist?q=" + d.data.link;
          }
        });

      newSlice.append('title')
        .text(d => d.data.nombre + '\n' + formatNumber(d.value));

      newSlice.append('path')
        .attr('class', 'main-arc')
        .style('stroke', '#fff')
        .style('stroke-width', '1px')
        .style('fill', d => color((d.children ? d : d.parent).data.nombre))
        .style('position', 'relative')
        .attr('d', arc);

      newSlice.append('path')
        .attr('class', 'hidden-arc')
        .style('fill', 'none')
        .attr('id', (_, i) => `hiddenArc${i}`)
        .attr('d', middleArcLine);

      const text = newSlice.append('text')
        // .attr('display', (d) => textFits(d) ? null : 'none')
        .attr('display', 'null')
        .style('pointer-events', 'none')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'middle');

      // Add white contour
      text.append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
        .text(d => d.data.nombre)
        .style('fill', 'none')
        .style('stroke', '#fff')
        .style('stroke-width', 5)
        .style('stroke-linejoin', 'round')
        .style('pointer-events', 'none')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'middle');

      text.append('textPath')
        .attr('startOffset', '50%')
        .attr('xlink:href', (_, i) => `#hiddenArc${i}`)
        .text(d => d.data.nombre)
        .style('pointer-events', 'none')
        .style('dominant-baseline', 'middle')
        .style('text-anchor', 'middle');
    }
    run();

    function focusOn(d = {
      x0: 0,
      x1: 1,
      y0: 0,
      y1: 1
    }) {
      // Reset to top-level if no data point specified

      const transition = svg.transition()
        .duration(750)
        .tween('scale', () => {
          const xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
            yd = d3.interpolate(y.domain(), [d.y0, 1]);
          return t => {
            x.domain(xd(t));
            y.domain(yd(t));
          };
        });

      transition.selectAll('path.main-arc')
        .attrTween('d', d => () => arc(d));

      transition.selectAll('path.hidden-arc')
        .attrTween('d', d => () => middleArcLine(d));

      transition.selectAll('text')
        .attrTween('display', d => () => textFits(d) ? null : 'none');

      moveStackToFront(d);

      //

      function moveStackToFront(elD) {
        svg.selectAll('.slice').filter(d => d === elD)
          .each(function (d) {
            this.parentNode.appendChild(this);
            if (d.parent) {
              moveStackToFront(d.parent);
            }
          })
      }
    }
  }

}
