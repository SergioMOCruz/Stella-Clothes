import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/products/products';
import { NavbarComponent } from '../../layout/shared/navbar/navbar.component';
import { FooterComponent } from '../../layout/shared/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { CommonModule } from '@angular/common';
import { Size } from '../../shared/enum/size';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})

export class ProductPageComponent {

  productRef;
  organizedProducts: Product[];
  infoProduct: Product;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService
  ) {
    this._route.paramMap.subscribe((params) => {
      this.productRef = params.get('ref');
    });

    this._productService.getProductByRef(this.productRef).subscribe((data) => {
      if (data) {
        if (Array.isArray(data)) {
          this.organizedProducts = this.sortBySizeAndStock(data);
          this.infoProduct = this.organizedProducts[0];
        }
      }
    });
  }

  sortBySizeAndStock(products: Product[]): Product[] {
    const organizedProducts: { [key in Size]: Product[] } = {} as { [key in Size]: Product[] };
    Object.values(Size).forEach(size => organizedProducts[size] = []);

    products.forEach(product => organizedProducts[product.size].push(product));

    products = Object.values(organizedProducts).flat();

    return products.sort((a, b) => {
      if (a.stock === b.stock) return 0;
      return a.stock > b.stock ? -1 : 1;
    });
  }
}
