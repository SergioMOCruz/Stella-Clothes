import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserSessionHandlerService } from './helpers/user-session-handler.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(
    public afAuth: AngularFireAuth,
    private _userSession: UserSessionHandlerService
  ) {
    this._userSession.checkSession();
  }

  signIn(email: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.afAuth
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
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
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  signOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this._userSession.setUserData(null);
    });
  }
}
