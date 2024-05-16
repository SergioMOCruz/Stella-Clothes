import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { OrderService } from '../services/orders/order.service';

@Injectable({
  providedIn: 'root'
})
export class OrderBelongsGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _orderService: OrderService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const orderId = next.params['id'];

    return this._orderService.verifyOrder(orderId).pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          this._router.navigate(['/404']);
          return false;
        }
      })
    );
  }

}
