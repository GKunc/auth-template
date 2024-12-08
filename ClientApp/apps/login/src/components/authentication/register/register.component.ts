import {
  Component,
  WritableSignal,
  inject,
  output,
  signal,
} from '@angular/core';
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

import { FormsModule } from '@angular/forms';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { GoogleButtonComponent } from '../../google-button/google-button.component';
import { HttpClient } from '@angular/common/http';
import { Mode } from 'apps/login/src/app/app.model';

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
  ],
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  switchMode = output<void>();
  loggedIn: WritableSignal<boolean> = signal(false);

  Mode: typeof Mode = Mode;

  authData: { email: string; password: string } = {
    email: '',
    password: '',
  };

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }

  login(): void {
    this.router.navigate(['login']);
  }
}
