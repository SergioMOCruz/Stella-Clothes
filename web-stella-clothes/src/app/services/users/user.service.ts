import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../shared/interfaces/users/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private _http: HttpClient
  ) { }

  getCurrentUser() {
    return this._http.get<User>(`${environment.apiUrl}/accounts/token`);
  }

  updateUserInfo(id, data) {
    return this._http.put(`${environment.apiUrl}/accounts/${id}`, data);
  }
}
