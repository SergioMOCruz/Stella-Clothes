import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-four-o-four',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './four-o-four.component.html',
  styleUrl: './four-o-four.component.scss'
})
export class FourOFourComponent {

  constructor() { }
}
