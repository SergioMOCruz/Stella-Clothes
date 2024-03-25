import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';

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

  constructor() { }

  products: Product[] = [];

}
