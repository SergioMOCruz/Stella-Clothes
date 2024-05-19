import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../shared/interfaces/orders/order';
import { environment } from '../../../environments/environment';
import { catchError, map, of, switchMap } from 'rxjs';
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
    return this._http.get<Order[]>(`${environment.apiUrl}/orders/account`);
  }

  getUserOrderById(orderId) {
    return this._http.get<Order>(`${environment.apiUrl}/orders/${orderId}`);
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

  verifyOrder(orderId) {
    return this._http.get<boolean>(`${environment.apiUrl}/orders/verify-orders/${orderId}`).pipe(
      map(data => {
        if (Object.keys(data).length !== 0) {
          return true;
        } else
          return false;
      }),
      catchError(error => {
        return of(false);
      })
    );
  }

  uploadPDF(orderId, pdfBlob: Blob) {
    const formData = new FormData();
    formData.append('pdfFile', pdfBlob, `Recibo_${orderId}.pdf`);

    return this._http.post(`${environment.apiUrl}/orders/upload-pdf/${orderId}`, formData);
  }
}
