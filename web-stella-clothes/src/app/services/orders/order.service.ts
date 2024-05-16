import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../shared/interfaces/orders/order';
import { environment } from '../../../environments/environment';
import { switchMap } from 'rxjs';
import { StripeService } from 'ngx-stripe';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http: HttpClient,
    private stripeService: StripeService
  ) { }

  getUserOrders() {
    return this._http.get<Order[]>(`${environment.apiUrl}/orders/account `);
  }

  sendCheckoutRequest(data) {
    return this._http.post(`${environment.apiUrl}/stripe/create-checkout-session`, data)
    .pipe(
      switchMap((session: any) => {
        return this.stripeService.redirectToCheckout({ sessionId: session.id });
      })
    );
  }

  sendOrderRequest(paymentId) {
    return this._http.post(`${environment.apiUrl}/orders`, paymentId);
  }

  getPaymentId() {
    return this._http.get(`${environment.apiUrl}/stripe/retrieve-payment-id`);
  }
}
