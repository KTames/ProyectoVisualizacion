import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-window',
  templateUrl: './main-window.component.html',
  styleUrls: ['./main-window.component.css']
})
export class MainWindowComponent implements OnInit {

  private buttons = [
    {title: "Artistas", link: "assets/img/artist.jpg", svg: "assets/svg/canto.svg", redirect: "artist"},
    {title: "Comparar géneros", link: "assets/img/genres.jpg", svg: "assets/svg/lp.svg", redirect: "genres"},
    {title: "Buscar música", link: "assets/img/microphone.jpg", svg: "assets/svg/nota-musical.svg", redirect: "music"}
  ];

  private formsClass: string;

  constructor() {
    this.formsClass = "col-" + (12 / this.buttons.length);
  }

  ngOnInit() {
  }

}
