import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private _http: HttpClient
  ) { }

  getCategories(): Observable<any> {
    return this._http.get(`${environment.apiUrl}/categories`);
  }

  getCategoryById(id: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/categories/${id}`);
  }

  getCategoryByDescription(description: string): Observable<any> {
    return this._http.get(`${environment.apiUrl}/categories/description/${description}`);
  }

  doesCategoryExist(description): Observable<boolean> {
    return this._http.get<boolean>(`${environment.apiUrl}/categories/description/${description}`).pipe(
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
}
