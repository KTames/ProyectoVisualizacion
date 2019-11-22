import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css']
})
export class GenresComponent implements OnInit {

  private genres = [
    { name: "Rock", link: "assets/img/rock.jpg", active: false },
    { name: "Metal", link: "assets/img/metal.jpg", active: false },
    { name: "Pop", link: "assets/img/pop.webp", active: false },
    { name: "Reggaeton", link: "assets/img/reggaeton.jpg", active: false },
    { name: "Indie", link: "assets/img/indie.jpg", active: false },
    { name: "Reggae", link: "assets/img/reggae.jpg", active: false },
    { name: "Rap", link: "assets/img/rap.jpg", active: false },
    { name: "Folk", link: "assets/img/folk.jpg", active: false },
  ];

  private originalShowGenres = [];
  private showGenres = [];
  private maxHeight: number;

  constructor() { }

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
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.maxHeight = window.innerHeight - document.getElementById('searchDiv').getBoundingClientRect().top - 20;
  }

  vote($event: boolean, genre: any) {
    genre.active = $event;
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

}
