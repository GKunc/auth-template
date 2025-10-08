import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleButtonComponent } from '../../google-button/google-button.component';
import { AuthService } from '@client-app/shared';

import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';
import { catchError, finalize } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [
    RouterModule,
    FormsModule,
    GoogleSigninButtonModule,
    GoogleButtonComponent,
    ButtonModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    PasswordModule,
    Message,
    Card,
    ReactiveFormsModule,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);
  private messageService: MessageService = inject(MessageService);
  private destroyedRef = inject(DestroyRef);

  loading = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required],
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  googleSignIn(googleWrapper: any) {
    googleWrapper.click();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService
        .login(this.loginForm.value)
        .pipe(
          takeUntilDestroyed(this.destroyedRef),
          catchError((e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: e.statusText,
            });
            return throwError(() => e);
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe((result: any) => {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          this.authService.loggedUser.set(jwtDecode(result.accessToken));
          this.router.navigate(['dashboard']);
        });
    }
  }

  createAccount(): void {
    this.router.navigate(['register']);
  }
}
