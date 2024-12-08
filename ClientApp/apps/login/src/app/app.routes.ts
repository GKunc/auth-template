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
        path: 'register',
        loadComponent: () =>
          import(
            '../components/authentication/register/register.component'
          ).then((c) => c.RegisterComponent),
      },
      {
        path: 'lessons',
        loadComponent: () =>
          import('../components/lessons/lessons.component').then(
            (c) => c.LessonsComponennt
          ),
      },
    ],
  },
];
