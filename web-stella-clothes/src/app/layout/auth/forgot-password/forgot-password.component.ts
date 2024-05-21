import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UtilsAuthService } from '../../../auth/services/helpers/utils-auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})

export class ForgotPasswordComponent {
  @Output() redirectToLoginEvent = new EventEmitter<void>();

  fpasswordForm: FormGroup;
  showWarningInvalid: boolean = false;
  showWarningValid: boolean = false;

  constructor(
    private _utilsAuthService: UtilsAuthService
  ) {
    this.fpasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  redirectToLogin() {
    this.redirectToLoginEvent.emit();
  }

  showWarning(type) {
    if (type === 'invalid') {
      this.showWarningInvalid = true;
      setTimeout(() => {
        this.showWarningInvalid = false;
      }, 2000);
    } else if (type === 'valid') {
      this.showWarningValid = true;
      setTimeout(() => {
        this.showWarningValid = false;
      }, 2000);
    }
  }

  validateAndRecover() {
    if (this.fpasswordForm.valid) {
      let email = this.fpasswordForm.get('email').value;

      this._utilsAuthService.forgotPassword(email).subscribe(
        data => {
          this.showWarning('valid');
        },
        error => {
          console.log(error);
          this.showWarning('invalid');
        });
    } else {
      this.showWarning('invalid');
    }
  }
}
