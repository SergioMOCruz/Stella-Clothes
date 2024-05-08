import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/users/user';
import { UserService } from '../users/user.service';
import { Order } from '../../shared/interfaces/orders/order';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http: HttpClient
  ) {

  }

  getUserOrders() {
    return this._http.get<Order[]>(`${environment.apiUrl}/orders/client`);
  }

}
