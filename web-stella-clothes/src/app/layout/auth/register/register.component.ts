import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { RegisterService } from '../../../auth/services/register.service';
import { RegisterInterface } from '../../../shared/interfaces/auth/register-interface';
import { UserSessionHandlerService } from '../../../auth/services/helpers/user-session-handler.service';
import { LoginService } from '../../../auth/services/login.service';
import { LoginInterface } from '../../../shared/interfaces/auth/login-interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {

  @Output() redirectToLoginEvent = new EventEmitter<void>();

  registerForm: FormGroup;
  showWarning: boolean = false;

  constructor(
    public router: Router,
    private _registerService: RegisterService,
    private _userSession: UserSessionHandlerService,
    private _loginService: LoginService
  ) {
    this.registerForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      nif: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      addressContinued: new FormControl(''),
      city: new FormControl('', Validators.required),
      postalCode: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    });
  }

  redirectToLogin() {
    this.redirectToLoginEvent.emit();
  }

  showInvalidDataWarning() {
    this.showWarning = true;
      setTimeout(() => {
        this.showWarning = false;
    }, 2000);
  }

  validateAndRegister() {
    if (this.registerForm.valid) {
      let dataUser: RegisterInterface = {
        firstName: this.registerForm.get('firstName').value,
        lastName: this.registerForm.get('lastName').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        phone: this.registerForm.get('phone').value,
        nif: this.registerForm.get('nif').value,
        address: this.registerForm.get('address').value,
        addressContinued: this.registerForm.get('addressContinued').value ?? '',
        city: this.registerForm.get('city').value,
        postalCode: this.registerForm.get('postalCode').value,
        country: this.registerForm.get('country').value
      }

      this._registerService.authRegister(dataUser).subscribe(
        data => {
          const loginData: LoginInterface = {email: dataUser.email, password: dataUser.password};

          this._loginService.authLogin(loginData).subscribe(
            data => {
              this._userSession.loginHelper(data);
            },
            error => this.showInvalidDataWarning()
          );
        },
        error => this.showInvalidDataWarning()
      );
    } else {
      this.showInvalidDataWarning();
    }
  }
}
