import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/interfaces/products/products';
import { NavbarComponent } from '../../layout/shared/navbar/navbar.component';
import { FooterComponent } from '../../layout/shared/footer/footer.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/products/product.service';
import { CommonModule } from '@angular/common';
import { Size } from '../../shared/enum/size';
import { CategoryService } from '../../services/categories/category.service';
import { FormsModule } from '@angular/forms';
import { CartItems } from '../../shared/interfaces/products/cart-items';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})

export class ProductPageComponent {
  selectedSize: Size;
  productRef;
  organizedProducts: Product[];
  infoProduct: Product;
  cart: CartItems[] = [];

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _categoryService: CategoryService,
    private _cartService: CartService
  ) {
    this._route.paramMap.subscribe((params) => {
      this.productRef = params.get('reference');
    });

    this._productService.getProductByRef(this.productRef).subscribe((data) => {
      if (data) {
        if (Array.isArray(data)) {
          this.organizedProducts = this.sortBySizeAndStock(data);
          this.infoProduct = this.organizedProducts[0];

          this._categoryService.getCategoryById(this.infoProduct.category).subscribe((data) => {
            this.infoProduct.category = data.description;
          });
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

  async addToCart() {
    let newItem: boolean = false;
    this.cart = [];

    await this._cartService.getCartByClient().subscribe((data) => {
      if (data !== null) this.cart = data;
    });

    this.organizedProducts.forEach(product => {
      if (product.size === this.selectedSize && product.stock > 0) {
        let newCartItem: CartItems = {
          productReference: product.reference,
          quantity: 1,
          size: product.size,
        };

        if (this.cart.length === 0) this.cart.push(newCartItem);
        else {
          for (const cartItem of this.cart) {
            if (cartItem.productReference === newCartItem.productReference) {
              cartItem.quantity += 1;
              return;
            } else {
              newItem = true;
            }
          }

          if (newItem) {
            this.cart.push(newCartItem);
          }
        }
      }
    });

    await this._cartService.changeItemsInCart(this.cart).subscribe();
  }
}
