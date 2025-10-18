import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TeachersListStore } from './teachers-list.store';
import { Teacher } from './teachers-list.model';
import { AddTeacherComponent } from '../add-teacher/add-teacher.component';

@Component({
  imports: [CardModule, TableModule, ButtonModule, ProgressSpinnerModule],
  providers: [TeachersListStore],
  selector: 'app-teachers-list',
  templateUrl: './teachers-list.component.html',
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
export class TeachersListComponent implements OnDestroy {
  store = inject(TeachersListStore);
  selectedTeacher!: Teacher;
  private dialogService: DialogService = inject(DialogService);
  private ref: DynamicDialogRef<AddTeacherComponent> | null = null;

  addNewTeacher(): void {
    this.openStudentDialog();
  }

  editTeacher(teacher: Teacher): void {
    this.store.selectTeacher(teacher);
    this.openStudentDialog(teacher);
  }

  removeTeacher(teacherId: string): void {
    this.store.removeTeacher(teacherId);
  }

  ngOnDestroy(): void {
    this.ref?.destroy();
  }

  private openStudentDialog(teacher?: Teacher): void {
    this.ref = this.dialogService.open(AddTeacherComponent, {
      inputValues: {
        teacher,
      },
      header: teacher ? 'Edit Teacher' : 'Add New Teacher',
      width: '50vw',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.ref?.onClose.subscribe(() => this.store.teachersResource()?.reload());
  }
}
