import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationExtras, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../auth/services/login.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserSessionHandlerService } from '../../../auth/services/helpers/user-session-handler.service';
import { LoginInterface } from '../../../shared/interfaces/auth/login-interface';
import { UserService } from '../../../services/users/user.service';
import { User } from '../../../shared/interfaces/users/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [],
})

export class LoginComponent {

  @Output() redirectToRegisterEvent = new EventEmitter<void>();
  @Output() redirectToForgotPasswordEvent = new EventEmitter<void>();

  loginForm: FormGroup;
  showWarning: boolean = false;
  user: User = null;

  constructor(
    public router: Router,
    private _loginService: LoginService,
    private _userSession: UserSessionHandlerService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  redirectToRegister() {
    this.redirectToRegisterEvent.emit();
  }

  redirectToForgotPassword() {
    this.redirectToForgotPasswordEvent.emit();
  }

  showInvalidDataWarning() {
    this.showWarning = true;
      setTimeout(() => {
        this.showWarning = false;
    }, 2000);
  }

  validateAndLogin() {
    if (this.loginForm.valid) {
      let dataUser: LoginInterface = {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value
      }

      this._loginService.authLogin(dataUser).subscribe(
        data => {
          this._userSession.loginHelper(data);
        },
        error => this.showInvalidDataWarning()
      );
    } else {
      this.showInvalidDataWarning();
    }
  }


}

