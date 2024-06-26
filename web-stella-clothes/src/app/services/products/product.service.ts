import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { flush } from '@angular/core/testing';
import { Size } from '../../shared/enum/size';
import { Product } from '../../shared/interfaces/products/products';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private _http: HttpClient
  ) { }

  createProducts() {

  }

  doesProductExist(reference): Observable<boolean> {
    return this._http.get<boolean>(`${environment.apiUrl}/products/reference/${reference}`).pipe(
      map(data => {
        if (Object.keys(data).length !== 0) {
          return true;
        } else
          return false;
      }),
      catchError(error => {
        return of(false);
      })
    );
  }

  getLastFour(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/products/lastFour`);
  }

  getProductByRef(reference: string) {
    return this._http.get<Product>(`${environment.apiUrl}/products/reference/${reference}`);
  }

  getProductStock(reference: string, size: Size) {
    const options = {
      params: { reference, size }
    };
    return this._http.get(`${environment.apiUrl}/products/stock`, options);
  }

  getProductsByCategory(category: string) {
    return this._http.get<Product[]>(`${environment.apiUrl}/products/category/${category}`);
  }

  searchProducts(searchTerm: string) {
    return this._http.get<Product[]>(`${environment.apiUrl}/products/search?searchTerm=${searchTerm}`);
  }
}
