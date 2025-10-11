import { Component, inject } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@client-app/shared';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-layout-wrapper',
  styleUrl: './layout-wrapper.component.less',
  templateUrl: './layout-wrapper.component.html',
})
export class LayoutWrapperComponent {
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
            this.router.navigate(['dashboard/summary']);
          },
        },
        {
          label: 'Students',
          icon: 'pi pi-list',
          command: () => {
            this.router.navigate(['dashboard/students-list']);
          },
        },
        {
          label: 'Teachers',
          icon: 'pi pi-list',
          command: () => {
            this.router.navigate(['dashboard/teachers-list']);
          },
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => {
            this.router.navigate(['dashboard/settings']);
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
