import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UtilsAuthService {

  constructor(
    private _http: HttpClient
  ) { }

  forgotPassword(passwordResetEmail: string) {
    return this._http.post(`${environment.apiUrl}/accounts/reset-pw`, { email: passwordResetEmail });
  }

  verifyToken(token: string) {
    return this._http.get(`${environment.apiUrl}/accounts/verify-token/${token}`);
  }

  updatePassword(token: string, password: string) {
    return this._http.put(`${environment.apiUrl}/accounts/update-pw/${token}`, { password: password });
  }
}
