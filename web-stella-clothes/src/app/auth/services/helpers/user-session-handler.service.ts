import { Injectable } from '@angular/core';
import { User } from '../../../shared/interfaces/users/user';
import { NavigationExtras, Router } from '@angular/router';
import { UserService } from '../../../services/users/user.service';

@Injectable({
  providedIn: 'root'
})

export class UserSessionHandlerService {

  constructor(
    private _router: Router,
    private _userService: UserService
  ) { }

  isLoggedIn(): boolean {
    return this.getLocalUserData() !== null;
  }

  setLocalToken(data) {
    localStorage.setItem('token', data.token);
  }

  getLocalUserData(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  setLocalUserData(user: User) {
    localStorage.setItem('user',  JSON.stringify(user));
  }

  loginHelper(data) {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true
    };

    this.setLocalToken(data);
    this._userService.getCurrentUser().subscribe(
      data => {
        this.setLocalUserData(data);

        this._router.navigate(['/home'], navigationExtras).then(() => {
          window.location.reload();
        });
      }
    );
  }
}

