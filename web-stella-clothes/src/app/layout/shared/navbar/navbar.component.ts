import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';

import { RightSidebarComponent } from '../right-sidebar/right-sidebar.component';
import { LoginComponent } from '../../auth/login/login.component';
import { RegisterComponent } from '../../auth/register/register.component';
import { UserSessionHandlerService } from '../../../auth/services/helpers/user-session-handler.service';
import { ForgotPasswordComponent } from '../../auth/forgot-password/forgot-password.component';
import { MiniCartComponent } from '../../../views/mini-cart/mini-cart.component';
import { ProfileNavbarComponent } from '../../../views/profile-navbar/profile-navbar.component';
import { SearchProductComponent } from '../../../modules/search-product/search-product.component';
import { CategoryService } from '../../../services/categories/category.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, RightSidebarComponent, LoginComponent, RegisterComponent, ForgotPasswordComponent, ProfileNavbarComponent, SearchProductComponent, MiniCartComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})

export class NavbarComponent {
  @ViewChild('rightSideBar') rightSidebar: RightSidebarComponent;

  categories = null;

  isVisible: boolean = false;
  showLogin: boolean = false;
  showRegister: boolean = false;
  showForgotPassword: boolean = false;
  showMiniCart: boolean = false;
  showProfileMenu: boolean = false;
  showSearchMenu: boolean = false;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private _userSession: UserSessionHandlerService,
    private _categoryService: CategoryService,
    private _router: Router,
  ) {
    this.isLoggedIn$ = this._userSession.isLoggedIn();

    this._categoryService.getCategories().subscribe(data => this.categories = data);
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
    this.showSearchMenu = false;
    this.showMiniCart = false;
  }

  toggleForm(formType: string) {
    this.showLogin = formType === 'login';
    this.showRegister = formType === 'register';
    this.showForgotPassword = formType === 'forgot-password';
    this.showMiniCart = formType === 'mini-cart';
    this.showProfileMenu = formType === 'my-account';
    this.showSearchMenu = formType === 'search-product';
  }

  redirectToCategory(reference) {
    this._router.navigate(['/category/' + reference]).then(() => {
      window.location.reload();
    });
  }
}
