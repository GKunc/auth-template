import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('../components/authentication/login/login.component').then(
            (c) => c.LoginComponent
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import('../components/lessons/lessons.component').then(
            (c) => c.LessonsComponennt
          ),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('../components/students/students.component').then(
            (c) => c.StudentsComponennt
          ),
      },
    ],
  },
];
