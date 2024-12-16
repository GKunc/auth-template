import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AuthService } from 'libs/shared/src/lib/services/auth.service';
import { provideIcons } from '@ng-icons/core';
import { lucideSettings } from '@ng-icons/lucide';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  providers: [provideIcons({ lucideSettings })],
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
