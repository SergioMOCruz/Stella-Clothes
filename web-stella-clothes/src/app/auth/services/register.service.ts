import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { UserSessionHandlerService } from './helpers/user-session-handler.service';
import { LoginService } from './login.service';
import { UtilsAuthService } from './helpers/utils-auth.service';

@Injectable({
  providedIn: 'root'
})

export class RegisterService {

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router,
    private _userSession: UserSessionHandlerService,
    private _utilsAuthService: UtilsAuthService
  ) { }

  signUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth
      .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          this._utilsAuthService.sendVerificationMail();
          this.afAuth.authState.subscribe((user) => {
            if (user) {
              result.user.multiFactor.getSession().then((session: any) => {
                this._userSession.setUserData(result.user);
                localStorage.setItem('token', session.credential);
                resolve(true);
              }).catch((error) => {
                reject(error);
              });
            } else {
              reject(new Error("User is null"));
            }
          });
          resolve(true);
        }).catch((error) => {
          reject(error);
        });
    });
  }
}
