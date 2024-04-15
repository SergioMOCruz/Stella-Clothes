import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product.service';
import { Product } from '../../shared/interfaces/products/products';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss'
})
export class SearchProductComponent {

  @Output() redirectToHomeEvent = new EventEmitter<void>();

  products: Product[] = [];

  constructor(
    private _productService: ProductService
  ) {
    this._productService.getLastFour().subscribe(
      data => this.products = data,
      error => this.products = null
    );
  }

  redirectToHome() {
    this.redirectToHomeEvent.emit();
  }
}
