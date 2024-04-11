import { Component } from '@angular/core';
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  cartItems: any[] = [
    {
      name: "Vestido Floral",
      size: "M",
      price: 39.99,
      quantity: 1,
      image: "../../../assets/images/vestido.jpg"
    },
    {
      name: "Camiseta Branca",
      size: "L",
      price: 14.99,
      quantity: 2,
      image: "../../../assets/images/camiseta.jpg"
    },
    // Add more items as needed
  ];

  removeItem(item: any): void {
    // Implement the logic to remove the item from the cart
    // For example:
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
    }
  }

  updateItem(item: any): void {
    // Implement the logic to update the item in the cart
  }

  getSubtotal(): number {
    let total = 0;
    for (const item of this.cartItems) {
      total += item.price * item.quantity;
    }
    return total;
  }

}
