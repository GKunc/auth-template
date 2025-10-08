import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
import { Student } from './student-list.model';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';

@Component({
  imports: [CardModule, TableModule, ButtonModule, ProgressSpinnerModule],
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }

      ::ng-deep .loader-container .p-card-content {
        width: 100%;
        display: flex;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  studentsResource: HttpResourceRef<Student[]> = httpResource<Student[]>(
    () => '/api/students',
    {
      defaultValue: [],
    }
  );

  selectedStudent!: Student;

  addNewStudent(): void {
    this.router.navigate(['dashboard/add-student']);
  }
}
