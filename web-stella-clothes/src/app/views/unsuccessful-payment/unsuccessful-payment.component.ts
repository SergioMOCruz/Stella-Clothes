import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-unsuccessful-payment',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './unsuccessful-payment.component.html',
  styleUrl: './unsuccessful-payment.component.scss'
})
export class UnsuccessfulPaymentComponent {

}
