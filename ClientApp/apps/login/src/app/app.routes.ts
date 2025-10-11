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
        path: 'email-confirmation',
        loadComponent: () =>
          import(
            '../components/authentication/email-confirmation/email-confirmation.component'
          ).then((c) => c.EmailConfirmationComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../components/dashboard/layout-wrapper.component').then(
            (c) => c.LayoutWrapperComponent
          ),
        children: [
          {
            path: 'summary',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/summary/summary.component'
              ).then((c) => c.SummaryComponent),
          },
          {
            path: 'students-list',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/students/students-list/student-list.component'
              ).then((c) => c.StudentListComponent),
          },
          {
            path: 'teachers-list',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/teachers/teachers-list/teachers-list.component'
              ).then((c) => c.TeachersListComponent),
          },
          {
            path: 'settings',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/settings/settings.component'
              ).then((c) => c.SettingsComponent),
          },
          {
            path: '**',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/not-found/not-found.component'
              ).then((c) => c.NotFoundComponent),
          },
        ],
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
