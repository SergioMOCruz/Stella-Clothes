import { Component } from '@angular/core';
import { FooterComponent } from "../../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../../layout/shared/navbar/navbar.component";
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/orders/order.service';
import { Order } from '../../../shared/interfaces/orders/order';
import { Observable } from 'rxjs';
import { UserSessionHandlerService } from '../../../auth/services/helpers/user-session-handler.service';

@Component({
  selector: 'app-myorders',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})

export class MyOrdersComponent {

  isLoggedIn$: Observable<boolean>;
  orders: any;
  productOrders: any;

  constructor(
    private _orderService: OrderService,
    private _userSession: UserSessionHandlerService,
    private _router: Router
  ) {
    this.isLoggedIn$ = this._userSession.isLoggedIn();

    this._orderService.getUserOrders().subscribe(
      data => {
        this.orders = data;
        this.sortOrdersByDate(this.orders); // Sort orders
        this.formatDate(this.orders);
      },
      error => console.log(error)
    );
  }

  sortOrdersByDate(orders) {
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  formatDate(orders) {
    for (let i = 0; i < orders.length; i++) {
      const dt = new Date(orders[i].createdAt);
      orders[i].createdAt = `${dt.getUTCHours().toString().padStart(2, '0')}:${dt.getUTCMinutes().toString().padStart(2, '0')} ${dt.getUTCDate().toString().padStart(2, '0')}-${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}-${dt.getUTCFullYear()}`;
    }
  }

  getNewestStatus(order: Order) {
    return order.status.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].status;
  }

  seeOrderDetails(orderId) {
    this._router.navigate(['/order-details/' + orderId]);
  }
}
