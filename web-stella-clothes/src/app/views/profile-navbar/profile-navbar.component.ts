import { Component } from '@angular/core';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { Router } from '@angular/router';
import { LoginService } from '../../auth/services/login.service';
import { User } from '../../shared/interfaces/users/user';

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
    public router: Router,
    private _userSession: UserSessionHandlerService,
    private _loginService: LoginService
  ) {
    // this.user = this._userSession.getLocalUserData() ?? this._loginService.signOut().subscribe(data => { this.router.navigate(['/home']); });
  }

}
