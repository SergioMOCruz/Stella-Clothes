import { Component } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product.service';
import { CartService } from '../../services/cart/cart.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {NgxStripeModule, StripeCardComponent } from "ngx-stripe";
import {FormsModule} from "@angular/forms";
import { OrderService } from '../../services/orders/order.service';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-checkout',
    standalone: true,
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.scss',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, FooterComponent, NavbarComponent, StripeCardComponent, NgxStripeModule, FormsModule]
})
export class CheckoutComponent {

  cartItems = [];
  checkoutInfoForm: FormGroup;
  isLoggedIn$: Observable<boolean>;
  isCartEmpty: boolean;
  showWarning: boolean = false;
  showDataWarning: boolean = false;

  constructor(
    private _productService: ProductService,
    private _cartService: CartService,
    private _orderService: OrderService,
    private _userSession: UserSessionHandlerService,
  ) {
    this.isLoggedIn$ = this._userSession.isLoggedIn();
    this._cartService.getCartByClient().subscribe(
      data => {
        if(data.length === 0) this.isCartEmpty = true
        else this.isCartEmpty = false;
      },
      error => this.isCartEmpty = true,
    );

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

    this.checkoutInfoForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      addressExtra: new FormControl(''),
      postalCode: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      nif: new FormControl('')
    });
  }

  getSubtotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return parseFloat(total.toFixed(2));
  }

  showInvalidDataWarning() {
    this.showDataWarning = true;
      setTimeout(() => {
        this.showDataWarning = false;
    }, 2000);
  }

  checkout() {
    let dataCheckout = {
      amount: this.getSubtotal() * 100,
      orderInfo: {
        contactInfo: this.checkoutInfoForm.get('email').value,
        firstName: this.checkoutInfoForm.get('firstName').value,
        lastName: this.checkoutInfoForm.get('lastName').value,
        street: this.checkoutInfoForm.get('street').value,
        addressExtra: this.checkoutInfoForm.get('addressExtra').value,
        postalCode: this.checkoutInfoForm.get('postalCode').value,
        city: this.checkoutInfoForm.get('city').value,
        country: this.checkoutInfoForm.get('country').value,
        nif: this.checkoutInfoForm.get('nif').value
      }
    }

    if (this.checkoutInfoForm.valid) {
      this._orderService.sendCheckoutRequest(dataCheckout).subscribe(
        data => {
          console.log(data)
        },
        error => {
          console.log(error)
          this.showWarning = true;

          setTimeout(() => {
            this.showWarning = false;
          }, 2000);
        }
      );
    } else {
      this.showInvalidDataWarning();
    }
  }
}
