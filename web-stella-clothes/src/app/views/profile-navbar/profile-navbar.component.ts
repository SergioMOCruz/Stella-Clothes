import { Component } from '@angular/core';
import { UserSessionHandlerService } from '../../auth/services/helpers/user-session-handler.service';
import { LoginService } from '../../auth/services/login.service';
import { User } from '../../shared/interfaces/users/user';
import { NavigationExtras, Router } from '@angular/router';
import { ChangeDataComponent } from '../change-data/change-data.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/users/user.service';

@Component({
  selector: 'app-profile-navbar',
  standalone: true,
  imports: [CommonModule, ChangeDataComponent],
  templateUrl: './profile-navbar.component.html',
  styleUrl: './profile-navbar.component.scss'
})

export class ProfileNavbarComponent {

  user: User;
  showMyAccountMenu: boolean = true;
  showChangeDataMenu: boolean = false;

  constructor(
    private _router: Router,
    private _userService: UserService,
    private _loginService: LoginService
  ) {
    this._userService.getCurrentUser().subscribe(
      data => this.user = data,
      error => console.log(error)
    );
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

  toggleForm(formType: string) {
    if (formType == 'my-orders') {
      this._router.navigate(['/my-orders']);
      return;
    }

    this.showMyAccountMenu = formType === 'my-account';
    this.showChangeDataMenu = formType === 'change-data';
  }
}
