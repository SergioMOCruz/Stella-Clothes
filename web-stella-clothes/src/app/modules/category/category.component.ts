import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CategoryService } from '../../services/categories/category.service';
import { ProductService } from '../../services/products/product.service';
import { Product } from '../../shared/interfaces/products/products';
import { NavbarComponent } from "../../layout/shared/navbar/navbar.component";
import { FooterComponent } from "../../layout/shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category',
    standalone: true,
    templateUrl: './category.component.html',
    styleUrl: './category.component.scss',
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NavbarComponent, FooterComponent]
})
export class CategoryComponent {

  category: string = null;
  idCategory: number = null;
  categoryProducts: Product[] = null;

  constructor(
    private _route: ActivatedRoute,
    private _categoryService: CategoryService,
    private _productService: ProductService,
  ) {
    this.category = this._route.snapshot.paramMap.get('description');
    this._categoryService.getCategoryByDescription(this.category).subscribe(data => this.idCategory = data._id);

    this._productService.getProductsByCategory(this.category).subscribe(data => this.categoryProducts = data);
  }

}
