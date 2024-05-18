import { Component } from '@angular/core';
import { NavbarComponent } from '../../../layout/shared/navbar/navbar.component';
import { OrderService } from '../../../services/orders/order.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  generatePDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Stella Clothes", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Av. Brasília, 1400-038 Lisboa", 105, 30, { align: "center" });
    doc.text("987 654 321", 105, 35, { align: "center" });

    doc.text("Nome Cliente: " + this.order.firstName + " " + this.order.lastName, 10, 50);
    doc.text("Recibo #" + this.order._id, 10, 60);
    doc.text("Data Encomenda: " + this.formatDate(this.order.createdAt), 10, 70);

    const formatOrderDataForTable = (orderData): (string | number)[][] => {
      return orderData.map(product => [
        product.name,
        product.quantity.toString(),
        `${product.priceAtTime} €`,
        `${product.priceAtTime * product.quantity} €`
      ]);
    };

    (doc as any).autoTable({
      startY: 80,
      head: [['Descrição Artigo', 'Quantidade', 'Preço/Unidade', 'Total']],
      body: formatOrderDataForTable(this.order.orderData),
      foot: [
        [{ content: 'Total', colSpan: 3, styles: { halign: 'right' } }, `${this.order.total} €`]
      ]
    });

    doc.text("Obrigado pelo teu pedido na Stella Clothes", 105, (doc as any).autoTable.previous.finalY + 20, { align: "center" });
    doc.text("Com os nossos melhores cumprimentos", 105, (doc as any).autoTable.previous.finalY + 30, { align: "center" });
    doc.text("Stella Clothes", 105, (doc as any).autoTable.previous.finalY + 35, { align: "center" });

    doc.save(`Recibo_${ this.order._id }.pdf`);
  }
}
