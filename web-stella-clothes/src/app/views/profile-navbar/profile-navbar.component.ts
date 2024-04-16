import { Component } from '@angular/core';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { LoginService } from '../../auth/services/login.service';
import { User } from '../../shared/interfaces/users/user';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-profile-navbar',
  standalone: true,
  imports: [],
  templateUrl: './profile-navbar.component.html',
  styleUrl: './profile-navbar.component.scss'
})

export class ProfileNavbarComponent {

  user: User;

  constructor(
    private _router: Router,
    private _userSession: UserSessionHandlerService,
    private _loginService: LoginService
  ) {
    this.user = this._userSession.getLocalUserData()
    if (!this.user) {
      this._loginService.signOut();
      this._router.navigate(['/']);
    }
  }

  signOut() {
    const navigationExtras: NavigationExtras = {
      skipLocationChange: true
    };

    this._loginService.signOut();
    this._router.navigate(['/'], navigationExtras).then(() => {
      window.location.reload();
    });
  }
}
