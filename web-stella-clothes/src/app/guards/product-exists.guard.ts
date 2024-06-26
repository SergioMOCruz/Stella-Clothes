import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ProductService } from '../services/products/product.service';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductExistsGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _productService: ProductService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const reference = next.params['reference'];
    return this._productService.doesProductExist(reference).pipe(
      map(isValid => {
        if (isValid)
          return true;
        else {
          this._router.navigate(['/404']);
          return false;
        }
      })
    );
  }
}
