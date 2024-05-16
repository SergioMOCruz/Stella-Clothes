import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/users/user.service';
import { User } from '../../shared/interfaces/users/user';

@Component({
  selector: 'app-change-data',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './change-data.component.html',
  styleUrl: './change-data.component.scss'
})

export class ChangeDataComponent {

  @Output() redirectToMyAccountEvent = new EventEmitter<void>();

  updateInfoForm: FormGroup;
  user: User;
  showInvalidWarning: boolean = false;
  showValidWarning: boolean = false;

  constructor(
    private _userService: UserService
  ) {
    this.updateInfoForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required)
    });

    this._userService.getCurrentUser().subscribe(
      data => {
        this.user = data;
        this.updateInfoForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone
        });
      },
      error => console.log(error)
    );
  }

  showDataWarning(type) {
    if(type == 'invalid') {
      this.showInvalidWarning = true;
      setTimeout(() => {
        this.showInvalidWarning = false;
      }, 2000);
    } else {
      this.showValidWarning = true;
      setTimeout(() => {
        this.showValidWarning = false;
      }, 2000);
    }
  }

  saveNewInfo() {
    if (this.updateInfoForm.valid) {
      let dataUser = {
        firstName: this.updateInfoForm.get('firstName').value,
        lastName: this.updateInfoForm.get('lastName').value,
        phone: this.updateInfoForm.get('phone').value,
        address: this.updateInfoForm.get('address').value,
        addressContinued: this.updateInfoForm.get('addressContinued').value,
        city: this.updateInfoForm.get('city').value,
        postalCode: this.updateInfoForm.get('postalCode').value,
        country: this.updateInfoForm.get('country').value
      }

      this._userService.updateUserInfo(this.user._id, dataUser).subscribe(
        data => this.showDataWarning('valid'),
        error => this.showDataWarning('invalid')
      );
    } else {
      this.showDataWarning('invalid');
    }
  }

  goBack() {
    this.redirectToMyAccountEvent.emit();
  }
}
