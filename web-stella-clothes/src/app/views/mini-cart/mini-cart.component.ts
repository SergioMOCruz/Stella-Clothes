import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
} from '@angular/router';
import { ProductsService } from '../../services/products.service';

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
  products: any[] = [];
  total: number = 0;

  constructor(public router: Router, private productsService: ProductsService) {
    this.products = this.productsService.getProducts();
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

  redirectToCart() {
    this.router.navigate(['/cart']);
  }

  redirectToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
