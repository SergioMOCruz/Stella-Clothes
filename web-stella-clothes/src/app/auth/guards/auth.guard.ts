import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserSessionHandlerService } from '../services/helpers/user-session-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _userSession: UserSessionHandlerService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this._userSession.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
