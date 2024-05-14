import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})

export class UtilsAuthService {

  constructor(
    public afAuth: AngularFireAuth,
  ) { }

  forgotPassword(passwordResetEmail: string) {
    return this.afAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .catch((error) => {
        window.alert(error);
      });
  }
}
