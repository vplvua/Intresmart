import {
  ApplicationConfig,
  inject,
  PLATFORM_ID,
  provideZoneChangeDetection,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { signInWithCustomToken } from 'firebase/auth';
import { environment } from '../environments/environment';
import { DOCUMENT } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideFirebaseApp(() => {
      const platformId = inject(PLATFORM_ID);
      if (isPlatformBrowser(platformId)) {
        return initializeApp(environment.firebase);
      } else {
        // Server-side initialization
        return initializeApp(environment.firebase);
      }
    }),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
};
