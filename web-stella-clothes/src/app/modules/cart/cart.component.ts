import { Component, EventEmitter, Output } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../shared/interfaces/products/products';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { CartItems } from '../../shared/interfaces/products/cart-items';
import { CartService } from '../../services/cart/cart.service';
import { ProductService } from '../../services/products/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  isLoggedIn: boolean = true;
  cartItems = [];

  constructor(
    private _userSession: UserSessionHandlerService,
    private _cartService: CartService,
    private _productService: ProductService
  ) {
    this.isLoggedIn = this._userSession.isLoggedIn();

    this._cartService.getCartByClient().subscribe(data => {
      this.cartItems = data;

      if (this.cartItems.length) {
        this.cartItems.forEach(product => {
          this._productService.getProductByRef(product.productReference).subscribe((data) => {
            product.price = data[0].price;
            this.getSubtotal();
          });
        });
      }
    });
  }

  async removeItem(product: any) {
    const index = this.cartItems.indexOf(product);
    if (index !== -1) {
      await this._cartService.removeItemfromCart(product).subscribe(data => {
        this.cartItems.splice(index, 1);
        this.getSubtotal();
      });
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
