import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { ProductService } from '../services/products/product.service';
import { Observable, map, tap } from 'rxjs';
import { CategoryService } from '../services/categories/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryExistsGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _categoryService: CategoryService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const description = next.params['description'];
    return this._categoryService.doesCategoryExist(description).pipe(
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
