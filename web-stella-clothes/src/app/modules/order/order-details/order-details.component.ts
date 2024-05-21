import { Component } from '@angular/core';
import { NavbarComponent } from '../../../layout/shared/navbar/navbar.component';
import { OrderService } from '../../../services/orders/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NavbarComponent],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {

  orderId = null;
  order;

  constructor (
    private _orderService: OrderService,
    private _route: ActivatedRoute,
  ) {
    this._route.paramMap.subscribe((params) => {
      this.orderId = params.get('id');
    });

    this._orderService.getUserOrderById(this.orderId).subscribe(
      data => {this.order = data; console.log(this.order)},
      error => console.log(error)
    )
  }

  formatDate(date) {
    const dt = new Date(date);

    return `${dt.getUTCHours().toString().padStart(2, '0')}:${dt.getUTCMinutes().toString().padStart(2, '0')} ${dt.getUTCDate().toString().padStart(2, '0')}-${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}-${dt.getUTCFullYear()}`;
  }

  getNewestStatus(order) {
    const newestStatus = order.status.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return {
        status: newestStatus.status,
        time: new Date(newestStatus.date)
    };
  }

  downloadFile(url){
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', url);
    link.setAttribute('download', `recibo.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  roundPrice(price) {
    return Math.round(price * 100) / 100;
  }

}
