import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/users/user';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private _http: HttpClient
  ) {

  }

  getUserOrders() {

  }

}
