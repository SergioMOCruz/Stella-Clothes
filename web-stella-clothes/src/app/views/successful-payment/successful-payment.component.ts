import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/orders/order.service';
import { CartService } from '../../services/cart/cart.service';

@Component({
  selector: 'app-successful-payment',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './successful-payment.component.html',
  styleUrl: './successful-payment.component.scss'
})
export class SuccessfulPaymentComponent {

  hashServer: string = "";
  hashClient: string = "";
  sessionId: string = "";
  carts: [] = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cartService: CartService,
    private _orderService: OrderService
  ) {
    this._route.queryParams.subscribe(params => {
      this.hashServer = params['hash'];
      this.sessionId  = params['sessionId'];
    })

    this._cartService.getCartByClientIdOrganized().subscribe(
      data => {
        this.carts = data;

        this.carts.forEach((element: any) => {
          this.hashClient += element._id;
        });

        if (this.hashClient === this.hashServer) {
          this._orderService.getPaymentId().subscribe(
            data => {
              let paymentId: any = data;

              this._orderService.sendOrderRequest(paymentId).subscribe(
                error => console.log(error)
              )
            },
            error => console.log(error)
          );
        }
      },
      error => console.log(error)
    );
  }
}
