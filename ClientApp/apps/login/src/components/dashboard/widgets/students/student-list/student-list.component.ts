import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule, TableRowReorderEvent } from 'primeng/table';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
import { Student } from './student-list.model';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { StudentListStore } from './student-list.store';

@Component({
  imports: [CardModule, TableModule, ButtonModule, ProgressSpinnerModule],
  providers: [StudentListStore],
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
  private router: Router = inject(Router);
  store = inject(StudentListStore);

  selectedStudent!: Student;

  addNewStudent(): void {
    this.router.navigate(['dashboard/add-student']);
  }

  editStudent(student: Student): void {
    this.store.selectStudents(student);
    this.router.navigate(['dashboard/add-student']);
  }

  removeStudent(student: Student): void {
    this.store.removeStudent(student);
  }
}
