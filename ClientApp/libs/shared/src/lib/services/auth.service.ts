import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CustomEncoder } from './custom-ecoder';
import { SKIP_HTTP_ERRORS_INTERCEPTOR } from '../interceptors/auth.interceptor';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  loggedUser: WritableSignal<LoggedUser | null> = signal(null);

  constructor() {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      this.loggedUser.set(jwtDecode(accessToken));
    }
  }

  login(credentials: { email: string; password: string }): Observable<void> {
    return this.http.post<void>('/api/accounts/login', credentials);
  }

  refreshAccessToken(): Observable<AccessTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .post<AccessTokenResponse>('/api/token/refresh', {
        refreshToken,
        accessToken,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
        }),
        catchError((error) => {
          console.error('Error refreshing access token:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['login']);
  }

  confirmEmail(token: string, email: string): Observable<null> {
    let params = new HttpParams({ encoder: new CustomEncoder() });
    params = params.append('token', token);
    params = params.append('email', email);

    return this.http.get<null>('/api/accounts/confirm-email', {
      params,
      context: new HttpContext().set(SKIP_HTTP_ERRORS_INTERCEPTOR, true),
    });
  }
}

export interface AccessTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoggedUser {
  role: string;
  firstName: string;
  lastName: string;
  emailName: string;
}
