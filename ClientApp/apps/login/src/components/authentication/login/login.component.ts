import { Component, WritableSignal, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';

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

@Component({
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    RouterModule,
    FormsModule,
    GoogleSigninButtonModule,
    GoogleButtonComponent,
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
