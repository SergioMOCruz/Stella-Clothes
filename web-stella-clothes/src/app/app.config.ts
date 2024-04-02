import {
  ApplicationConfig,
  importProvidersFrom,
  importProvidersFrom as importProvidersFrom_alias,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideFirebaseApp,
  initializeApp as initializeApp_alias,
} from '@angular/fire/app';
import { provideAuth, getAuth as getAuth_alias } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ]),
    importProvidersFrom_alias(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'loja-online-979c4',
          appId: '1:640772130099:web:d85b5cf857b87109fa6a46',
          storageBucket: 'loja-online-979c4.appspot.com',
          apiKey: 'AIzaSyDQUd8PM3D45W54WDGnjzNl-bKkS-mGJLo',
          authDomain: 'loja-online-979c4.firebaseapp.com',
          messagingSenderId: '640772130099',
        })
      ),
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ),
    importProvidersFrom_alias(provideAuth(() => getAuth())),
  ],
};
