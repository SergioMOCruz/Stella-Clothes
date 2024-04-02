import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }
],
})
  export class LoginComponent implements OnInit {
  constructor(public authService: AuthService) {}
  ngOnInit() {}

  login(email:string, password:string) {
   const isLogged = this.authService.SignIn(email, password);
  }

}

