import { Component, inject } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@client-app/shared';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.component.less',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private router: Router = inject(Router);
  private authService: AuthService = inject(AuthService);

  menuItems: MenuItem[] = [
    {
      label: '',
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          command: () => {
            this.router.navigate(['dashboard']);
          },
        },
        {
          label: 'Students',
          icon: 'pi pi-list',
          command: () => {
            this.router.navigate(['dashboard/student-list']);
          },
        },
        {
          label: 'Teachers',
          icon: 'pi pi-list',
          command: () => {
            this.router.navigate(['dashboard/teacher-list']);
          },
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => {
            this.router.navigate(['dashboard/settins']);
          },
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.authService.logout();
          },
        },
      ],
    },
  ];
}
