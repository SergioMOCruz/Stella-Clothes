import { Injectable } from '@angular/core';
import { User } from '../../../shared/interfaces/users/user';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserSessionHandlerService {

  user: User;

  constructor(
    private _router: Router,
    private _userService: UserService
  ) { }

  isLoggedIn(): Observable<boolean> {
    return this._userService.getCurrentUser().pipe(
      map(user => !!user),
      catchError(() => of(false))
    );
  }

  setLocalToken(data) {
    localStorage.setItem('token', data.token);
  }

  getLocalToken(): string | boolean {
    return localStorage.getItem('token') ?? false;
  }

  loginHelper(data) {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true
    };

    this.setLocalToken(data);
    this._userService.getCurrentUser().subscribe(
      data => {
        this._router.navigate(['/home'], navigationExtras).then(() => {
          window.location.reload();
        });
      }
    );
  }
}

