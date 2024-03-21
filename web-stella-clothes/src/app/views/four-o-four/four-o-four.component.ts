import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-four-o-four',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './four-o-four.component.html',
  styleUrl: './four-o-four.component.scss'
})
export class FourOFourComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
