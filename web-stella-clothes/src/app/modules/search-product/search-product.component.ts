import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/products/product.service';
import { Product } from '../../shared/interfaces/products/products';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-search-product',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule ],
  templateUrl: './search-product.component.html',
  styleUrl: './search-product.component.scss'
})
export class SearchProductComponent {

  @Output() redirectToHomeEvent = new EventEmitter<void>();

  searchTerm: string = '';
  searchResults: any[] = [];
  products: Product[] = [];
  loading: boolean = false;

  private searchTerms = new Subject<string>();
  private subscription: Subscription;

  constructor(
    private _productService: ProductService
  ) {
    this._productService.getLastFour().subscribe(
      data => this.products = data,
      error => this.products = null
    );

    this.subscription = this.searchTerms.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(term => {
        this.loading = true;
        if (term.length >= 3) {
          return this._productService.searchProducts(this.searchTerm);
        } else {
          this.loading = false;
          return of([]);
        }
      })
    ).subscribe((results: any[]) => {
      this.searchResults = results;
      console.log("products", this.searchResults)
      this.loading = false;
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onSearch(): void {
    this.loading = true;
    this.searchTerms.next(this.searchTerm);
  }

  redirectToHome() {
    this.redirectToHomeEvent.emit();
  }
}
