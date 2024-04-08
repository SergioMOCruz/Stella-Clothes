import {
  ApplicationConfig,
  importProvidersFrom,
  importProvidersFrom as importProvidersFrom_alias,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAuth, getAuth as getAuth_alias } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';
import { provideStorage } from '@angular/fire/storage';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
    ]),

    importProvidersFrom_alias(
      AngularFireModule.initializeApp(environment.firebaseConfig),
    ),
    importProvidersFrom_alias(provideAuth(() => getAuth())),
    provideAnimationsAsync()
  ],
};

