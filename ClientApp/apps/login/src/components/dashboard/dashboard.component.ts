import { Component, inject } from '@angular/core';
import {
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';

import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/shared/src/lib/services/auth.service';
import { HlmH2Directive } from '@spartan-ng/ui-typography-helm';

@Component({
  standalone: true,
  imports: [
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    CommonModule,
    HlmH2Directive,
  ],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
    `
      .dashboard__grid {
        height: calc(100vh - 120px);
      }
    `,
  ],
})
export class DashboardComponent {
  authService: AuthService = inject(AuthService);
}
