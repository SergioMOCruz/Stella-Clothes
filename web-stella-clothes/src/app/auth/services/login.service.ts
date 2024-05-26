import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginInterface } from '../../shared/interfaces/auth/login-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(
    private _http: HttpClient
  ) { }

  authLogin(data: LoginInterface) {
    return this._http.post(`${environment.apiUrl}/accounts/login`, data);
  }

  signOut() {
    localStorage.clear();
    return true;
  }
}
