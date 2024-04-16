import { Component } from '@angular/core';
import { Product } from '../../shared/interfaces/products/products';
import { NavbarComponent } from '../../layout/shared/navbar/navbar.component';
import { FooterComponent } from '../../layout/shared/footer/footer.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {

  product: Product;

}
