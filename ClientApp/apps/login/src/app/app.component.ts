import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { Mode } from './app.model';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, GoogleSigninButtonModule],
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
