import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';

import { HlmSeparatorDirective } from '@spartan-ng/ui-separator-helm';
import { BrnSeparatorComponent } from '@spartan-ng/ui-separator-brain';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { GoogleButtonComponent } from "../components/google-button.component";

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
    GoogleButtonComponent
],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less',
})
export class AppComponent implements OnInit {
  http: HttpClient = inject(HttpClient);
  authService:SocialAuthService = inject(SocialAuthService);

  title = 'login';

  authData: {email: string; password: string} = {
    email: '',
    password:'',
  };

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log(user)
      //perform further logics
    });    
  }

  googleSignin(googleWrapper: any) {
    googleWrapper.click();
  }
  
  toggleTheme(): void {
    const htmlElement = document.documentElement;
    if (document.documentElement.classList?.contains('dark')) {
      htmlElement.classList.remove('dark');
      return;
    }
    htmlElement.classList.add('dark');
  }

  login(): void {
    console.log(this.authData)
    this.http.get('https://fakestoreapi.com/products/1').subscribe();
  }
}
