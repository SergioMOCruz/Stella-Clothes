import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';

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
  products: any[] = [];
  total: number = 0;

  constructor(
    private _router: Router,
    private _productService: ProductService,
    private _userSession: UserSessionHandlerService
  ) {
    this.isLoggedIn = this._userSession.isLoggedIn();
    // this.products = this._productService.getProducts();
    this.calculateTotal();
  }

  removeProductFromCart(product: any) {
    const index = this.products.indexOf(product);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.calculateTotal();
    }
  }

  calculateTotal() {
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
