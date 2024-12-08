import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);

  loggedIn: WritableSignal<boolean> = signal(false);

  login(credentials: { email: string; password: string }): void {
    this.http
      .post<any>('/api/accounts/login', credentials)
      .pipe(
        catchError((e) => {
          toast.error('Error', {
            description: 'Incorrect email or password',
          });
          return throwError(e);
        })
      )
      .subscribe((result: any) => {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('refreshToken', result.refreshToken);
        this.router.navigate(['lessons']);
      });
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refreshToken');
    const accessToken = localStorage.getItem('accessToken');
    return this.http
      .post<any>('/api/token/refresh', {
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
}
