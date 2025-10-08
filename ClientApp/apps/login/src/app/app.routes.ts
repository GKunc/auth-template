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
          import('../components/dashboard/dashboard.component').then(
            (c) => c.DashboardComponent
          ),
        children: [
          {
            path: 'add-student',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/students/add-student/add-student.component'
              ).then((c) => c.AddStudentComponent),
          },
          {
            path: 'student-list',
            loadComponent: () =>
              import(
                '../components/dashboard/widgets/students/student-list/student-list.component'
              ).then((c) => c.StudentListComponent),
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
      {
        path: 'students',
        loadComponent: () =>
          import('../components/students/students.component').then(
            (c) => c.StudentsComponent
          ),
      },
    ],
  },
];
