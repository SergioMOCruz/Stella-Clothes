import { Component, EventEmitter, Output } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { NavigationExtras, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../auth/services/login.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }
  ],
})

export class LoginComponent {

  @Output() redirectToRegisterEvent = new EventEmitter<void>();
  @Output() redirectToForgotPasswordEvent = new EventEmitter<void>();

  loginForm: FormGroup;
  showWarning: boolean = false;

  constructor(
    public router: Router,
    private _loginService: LoginService
  ) {
    this.loginForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required)
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
      let userEmail = this.loginForm.get('userEmail').value;
      let userPassword = this.loginForm.get('userPassword').value;

      const navigationExtras: NavigationExtras = {
        skipLocationChange: true
      };

      this._loginService.signIn(userEmail, userPassword)
      .then(() => {
        this.router.navigate(['/home'], navigationExtras).then(() => {
          window.location.reload();
        });
      })
      .catch(() => {
        this.showInvalidDataWarning();
      });
    } else {
      this.showInvalidDataWarning();
    }
  }
}

