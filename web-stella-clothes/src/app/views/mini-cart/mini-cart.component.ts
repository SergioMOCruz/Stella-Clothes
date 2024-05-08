import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { CartService } from '../../services/cart/cart.service';
import { CartItems } from '../../shared/interfaces/products/cart-items';

@Component({
  selector: 'app-mini-cart',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './mini-cart.component.html',
  styleUrl: './mini-cart.component.scss',
})
export class MiniCartComponent {

  @Output() redirectToLoginEvent = new EventEmitter<void>();

  isLoggedIn: boolean = true;
  products = [];
  total: number = 0;

  constructor(
    private _router: Router,
    private _productService: ProductService,
    private _userSession: UserSessionHandlerService,
    private _cartService: CartService
  ) {
    this.isLoggedIn = this._userSession.isLoggedIn();

    this._cartService.getCartByClient().subscribe(data => {
      this.products = data;

      if (this.products.length) {
        this.products.forEach(product => {
          this._productService.getProductByRef(product.productReference).subscribe((data) => {
            product.price = data[0].price;
            this.getSubtotal();
          });
        });
      }

    });
  }

  async removeProductFromCart(product: any) {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      await this._cartService.removeItemfromCart(product).subscribe(data => {
        this.products.splice(index, 1);
        this.getSubtotal();
      });
    }
  }

  getSubtotal() {
    this.total = this.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
  }

  redirectToMenu(page: string) {
    this._router.navigate([`/${page}`]);
  }

  redirectToLogin() {
    this.redirectToLoginEvent.emit();
  }
}
