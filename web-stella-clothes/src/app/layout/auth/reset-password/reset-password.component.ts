import { Component } from '@angular/core';
import { UtilsAuthService } from '../../../auth/services/helpers/utils-auth.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetPasswordForm: FormGroup;
  showWarningValid: boolean = false;
  showWarningInvalid: boolean = false;
  token = null;

  constructor(
    private _utilsAuthService: UtilsAuthService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', Validators.required),
      password_confirm: new FormControl('', Validators.required)
    });

    this._route.paramMap.subscribe((params) => {
      this.token = params.get('token');
      if (!this.token) {
        this._router.navigate(['/404']);
      }
    });
  }

  showWarning(type) {
    if (type === 'invalid') {
      this.showWarningInvalid = true;
      setTimeout(() => {
        this.showWarningInvalid = false;
      }, 2000);
    } else if (type === 'valid') {
      this.showWarningValid = true;
    }
  }

  updatePassword() {
    let password = this.resetPasswordForm.get('password').value;
    let password_confirm = this.resetPasswordForm.get('password_confirm').value;

    if (password === password_confirm) {
      this._utilsAuthService.updatePassword(this.token, password).subscribe(
        data => this.showWarning('valid'),
        error => this.showWarning('invalid')
      );
    } else {
      this.showWarning('invalid');
    }

  }
}
