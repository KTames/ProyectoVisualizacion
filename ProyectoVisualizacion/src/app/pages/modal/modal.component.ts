import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  @Input() name: string
  @Input() artists: string
  @Input() popularity: number
  @Input() duration: string
  @Input() image: string

  @Input() show: boolean


  ngOnInit() {
  }

}
