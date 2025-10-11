import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Student } from './student-list.model';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { StudentListStore } from './student-list.store';
import { AddStudentComponent } from '../add-student/add-student.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  imports: [CardModule, TableModule, ButtonModule, ProgressSpinnerModule],
  providers: [StudentListStore],
  selector: 'app-students-list',
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
export class StudentListComponent implements OnDestroy {
  store = inject(StudentListStore);
  selectedStudent!: Student;
  private dialogService: DialogService = inject(DialogService);
  private ref: DynamicDialogRef<AddStudentComponent> | null = null;

  addNewStudent(): void {
    this.openStudentDialog();
  }

  editStudent(student: Student): void {
    this.store.selectStudents(student);
    this.openStudentDialog(student);
  }

  removeStudent(studentId: string): void {
    this.store.removeStudent(studentId);
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }

  private openStudentDialog(student?: Student): void {
    this.ref = this.dialogService.open(AddStudentComponent, {
      inputValues: {
        student,
      },
      header: student ? 'Edit Student' : 'Add New Student',
      width: '50vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.ref?.onClose.subscribe(() => this.store.studentsResource()?.reload());
  }
}
