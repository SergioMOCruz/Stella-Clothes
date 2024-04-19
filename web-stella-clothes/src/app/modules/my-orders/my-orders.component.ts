import { Component } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../shared/interfaces/users/user';
import { OrderService } from '../../services/orders/order.service';
import { Order } from '../../shared/interfaces/orders/order';


interface MyOrder {
  status: string;
  date: string;
  price: string;
  images: string[];
}

@Component({
  selector: 'app-myorders',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})

export class MyOrdersComponent implements AfterViewInit {

  orders: MyOrder[]

  @ViewChild('orderProducts') orderProducts: ElementRef;

  constructor(
    private _userService: UserService,
    private _orderService: OrderService
  ) {
    // this._orderService.getUserOrders().subscribe(
    //   data => this.orders = data
    // );
  }

  ngAfterViewInit() {
    this.checkShadow();
  }

  checkShadow() {
    const orderWidth = this.orderProducts.nativeElement.clientWidth;
    const imageWidth = 250;
    const totalImagesWidth = this.orders.reduce((acc, order) => acc + order.images.length * imageWidth, 0);

    if (totalImagesWidth > orderWidth) {
      this.showShadow();
    } else {
      this.hideShadow();
    }
  }

  showShadow() {
    const shadowElements = this.orderProducts.nativeElement.getElementsByClassName("order-products-shadow");
    for (let i = 0; i < shadowElements.length; i++) {
      shadowElements[i].style.display = "block";
    }
  }

  hideShadow() {
    const shadowElements = this.orderProducts.nativeElement.getElementsByClassName("order-products-shadow");
    for (let i = 0; i < shadowElements.length; i++) {
      shadowElements[i].style.display = "none";
    }
  }
}
