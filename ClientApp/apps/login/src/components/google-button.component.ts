import { Component, EventEmitter, Output } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconComponent } from '@spartan-ng/ui-icon-helm';


@Component({
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmIconComponent,
  ],
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
})
export class GoogleButtonComponent {
    @Output() loginWithGoogle: EventEmitter<any> = new EventEmitter<any>();

    createFakeGoogleWrapper = () => {
      const googleLoginWrapper = document.createElement('div');
      googleLoginWrapper.style.display = 'none';
      googleLoginWrapper.classList.add('custom-google-button');
      document.body.appendChild(googleLoginWrapper);
      (window as any).google.accounts.id.renderButton(googleLoginWrapper, {
        type: 'icon',
        width: '200',
      });
  
      const googleLoginWrapperButton = googleLoginWrapper.querySelector(
        'div[role=button]'
      ) as HTMLElement;
  
      return {
        click: () => {
          googleLoginWrapperButton?.click();
        },
      };
    };
  
    handleGoogleLogin() {
      this.loginWithGoogle.emit(this.createFakeGoogleWrapper());
    }
  }