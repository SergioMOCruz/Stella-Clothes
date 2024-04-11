import { Injectable } from '@angular/core';
import { User } from '../../../shared/interfaces/user';

@Injectable({
  providedIn: 'root'
})

export class UserSessionHandlerService {
  userData: any = null;

  constructor() { }

  isLoggedIn(): boolean {
    return this.userData !== null;
  }

  setLocalToken(data) {
    localStorage.setItem('token', data.token);
  }

  getLocalToken() {
    return localStorage.getItem('token');
  }

  getLocalUserData() {
    return JSON.stringify(localStorage.getItem('user'));
  }

  setLocalUserData(user: User) {
    this.userData = user;
    localStorage.setItem('user',  JSON.stringify(user));
  }
}

