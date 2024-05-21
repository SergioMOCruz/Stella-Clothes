import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UtilsAuthService } from '../auth/services/helpers/utils-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordGuard implements CanActivate {

  constructor(
    private _router: Router,
    private _utilsAuthService: UtilsAuthService
  ) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const token: string = next.params['token'];
    return this._utilsAuthService.verifyToken(token).pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          this._router.navigate(['/404']);
          return false;
        }
      }),
      catchError(() => {
        this._router.navigate(['/404']);
        return of(false);
      })
    );
  }
}
