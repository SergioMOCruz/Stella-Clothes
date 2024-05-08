import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItems } from '../../shared/interfaces/products/cart-items';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private _http: HttpClient
  ) { }

  getCartByClient(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/cart`);
  }

  updateCart(cart: CartItems[]) : Observable<any> {
    return this._http.post(`${environment.apiUrl}/cart`, cart);
  }

  removeItemfromCart(product: CartItems) : Observable<any> {
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: product,
    };

    return this._http.delete(`${environment.apiUrl}/cart`, options);
  }

}
