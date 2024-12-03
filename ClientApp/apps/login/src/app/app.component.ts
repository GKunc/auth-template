import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';

import { FormsModule } from '@angular/forms';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { LoginComponent } from '../components/login/login.component';
import { Mode } from './app.model';
import { RegisterComponent } from '../components/register/register.component';

@Component({
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmFormFieldModule,
    RouterModule,
    FormsModule,
    GoogleSigninButtonModule,
    LoginComponent,
    RegisterComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  authService: SocialAuthService = inject(SocialAuthService);

  title = 'login-app';

  mode: WritableSignal<Mode> = signal<Mode>(Mode.Login);
  Mode: typeof Mode = Mode;

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user);
      //perform further logics
    });
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;
    if (document.documentElement.classList?.contains('dark')) {
      htmlElement.classList.remove('dark');
      return;
    }
    htmlElement.classList.add('dark');
  }
}
