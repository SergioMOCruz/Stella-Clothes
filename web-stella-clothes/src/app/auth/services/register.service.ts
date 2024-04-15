import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegisterInterface } from '../../shared/interfaces/auth/register-interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(
    private _http: HttpClient
  ) { }

  authRegister(data: RegisterInterface) {
    return this._http.post(`${environment.apiUrl}/clients/register`, data);
  }
}
