import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { UserSessionHandlerService } from '../../../auth/services/helpers/user-session-handler.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ForgotPasswordComponent } from '../../auth/forgot-password/forgot-password.component';
import { ProfileNavbarComponent } from '../../../views/profile-navbar/profile-navbar.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, RightSidebarComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent, ProfileNavbarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  @ViewChild('rightSideBar') rightSidebar: RightSidebarComponent;

  isVisible: boolean = false;
  showLogin: boolean = false;
  showRegister: boolean = false;
  showForgotPassword: boolean = false;
  showProfileMenu: boolean = false;
  isLoggedIn = null;

  constructor(
    private _userSession: UserSessionHandlerService,
    public afAuth: AngularFireAuth,
  ) {
    this.isLoggedIn = this._userSession.isLoggedIn();
  }

  toggleRightSidebar() {
    this.rightSidebar.toggleDrawer();
  }

  toggleOverlay() {
    this.isVisible = !this.isVisible;
    this.closeMenuEvent();
  }

  closeMenuEvent() {
    this.showLogin = false;
    this.showRegister = false;
    this.showForgotPassword = false;
    this.showProfileMenu = false;
  }

  toggleForm(formType: string) {
    this.showLogin = formType === 'login';
    this.showRegister = formType === 'register';
    this.showForgotPassword = formType === 'forgot-password';
    this.showProfileMenu = formType === 'my-account';
  }
}
