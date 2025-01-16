import {
  HttpContextToken,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const SKIP_HTTP_ERRORS_INTERCEPTOR: HttpContextToken<boolean> =
  new HttpContextToken(() => false);

export function loggingInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<unknown>> {
  const accessToken = localStorage.getItem('accessToken');

  if (request.url.includes('api') && accessToken) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error) => {
      if (request.context.get(SKIP_HTTP_ERRORS_INTERCEPTOR)) {
        return throwError(() => error);
      }
      console.log('error', error);
      if (error.status === 401 && accessToken) {
        return handleTokenExpired(request, next, authService);
      }
      return throwError(() => error);
    })
  );
}

function handleTokenExpired(
  request: HttpRequest<any>,
  next: HttpHandlerFn,
  authService: AuthService
): Observable<HttpEvent<any>> {
  return authService.refreshAccessToken().pipe(
    switchMap(() => {
      const accessToken = localStorage.getItem('accessToken');

      if (request.url.includes('api') && accessToken) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      return next(request);
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
}
