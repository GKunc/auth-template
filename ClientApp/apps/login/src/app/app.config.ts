import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { loggingInterceptor } from '@client-app/shared';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight, lucideLogIn, lucideTrash } from '@ng-icons/lucide';
import { Observable } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { AuthService } from '@client-app/shared';
import { MessageService } from 'primeng/api';
import { MyPreset } from './ng-prime.preset';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthService,
    MessageService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '369057155684-asfr5bb591sefss8aff1dtmieuol5oob.apps.googleusercontent.com'
            ),
          },
        ],
        onError: (error) => {
          console.error(error);
        },
      } as SocialAuthServiceConfig,
    },
    provideIcons({
      lucideChevronRight,
      lucideLogIn,
      lucideTrash,
    }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false,
        },
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(
      withInterceptors([
        (
          request: HttpRequest<unknown>,
          next: HttpHandlerFn
        ): Observable<HttpEvent<unknown>> =>
          loggingInterceptor(request, next, inject(AuthService)),
      ])
    ),
  ],
};
