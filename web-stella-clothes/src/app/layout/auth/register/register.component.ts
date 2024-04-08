import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { RegisterService } from '../../../auth/services/register.service';

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
    private _registerService: RegisterService
  ) {
    this.registerForm = new FormGroup({
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPassword: new FormControl('', Validators.required)
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
      let userEmail = this.registerForm.get('userEmail').value;
      let userPassword = this.registerForm.get('userPassword').value;

      const navigationExtras: NavigationExtras = {
        skipLocationChange: true
      };

      this._registerService.signUp(userEmail, userPassword)
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
