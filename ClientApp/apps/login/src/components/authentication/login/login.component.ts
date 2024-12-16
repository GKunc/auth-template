import { Component, inject } from '@angular/core';
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
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'libs/shared/src/lib/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { Message } from 'primeng/message';
import { Card } from 'primeng/card';

@Component({
  standalone: true,
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
    CommonModule,
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, {
      validators: [Validators.required],
    }),
    password: new FormControl(null, {
      validators: [Validators.required],
    }),
  });

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

  login(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value);
    }
  }

  createAccount(): void {
    this.router.navigate(['register']);
  }
}
