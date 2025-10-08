import { Component, input, output } from '@angular/core';
import { Mode } from '../../app/app.model';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  selector: 'app-google-button',
  templateUrl: './google-button.component.html',
})
export class GoogleButtonComponent {
  [x: string]: any;
  public readonly mode = input<Mode>(Mode.Login);

  readonly loginWithGoogle = output<any>();

  Mode: typeof Mode = Mode;

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
