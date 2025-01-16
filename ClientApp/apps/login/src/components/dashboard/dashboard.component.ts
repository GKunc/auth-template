import { Component, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api/menuitem';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, MenuModule, RouterModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.component.less',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private router: Router = inject(Router);

  menuItems: MenuItem[] | undefined;

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-plus',
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-home',
          },
        ],
      },
      {
        label: 'Students',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
            command: () => {
              this.router.navigate(['dashboard/add-student']);
            },
          },
          {
            label: 'List',
            icon: 'pi pi-list',
            command: () => {
              this.router.navigate(['dashboard/student-list']);
            },
          },
        ],
      },
      {
        label: 'Teachers',
        items: [
          {
            label: 'New',
            icon: 'pi pi-plus',
          },
          {
            label: 'List',
            icon: 'pi pi-list',
          },
        ],
      },
      {
        label: 'Profile',
        items: [
          {
            label: 'Settings',
            icon: 'pi pi-cog',
          },
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
          },
        ],
      },
    ];
  }
}
