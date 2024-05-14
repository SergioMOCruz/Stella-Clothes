import { Component } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product.service';
import { CartService } from '../../services/cart/cart.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, FooterComponent, NavbarComponent]
})
export class CheckoutComponent {

  cartItems = [];
  total: number = 0;
  checkoutInfoForm: FormGroup;

  constructor(
    private _productService: ProductService,
    private _cartService: CartService
  ) {
    this._cartService.getCartByClient().subscribe(data => {
        this.cartItems = data;

        if (this.cartItems.length) {
          this.cartItems.forEach(product => {
            this._productService.getProductByRef(product.productReference).subscribe((data) => {
              product.name = data[0].name;
              product.price = data[0].price;
              this.getSubtotal();
            });
          });
        }
      },
      error => console.log(error)
    );
  }
  getSubtotal() {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total.toFixed(2);
  }
}
