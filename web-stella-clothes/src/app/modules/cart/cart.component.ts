import { Component, EventEmitter, Output } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/interfaces/products/products';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  isLoggedIn: boolean = true;
  cartItems: Product[] = [];

  constructor(
    private _userSession: UserSessionHandlerService,
  ) {
    this.isLoggedIn = this._userSession.isLoggedIn();
  }

  removeItem(item: any): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  getSubtotal() {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total.toFixed(2);
  }

  calculateItemSubtotal(price, qty) {
    return (price * qty).toFixed(2);
  }
}
