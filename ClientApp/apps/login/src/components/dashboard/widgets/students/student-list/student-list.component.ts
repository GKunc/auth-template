import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { Student } from './student-list.model';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }

      ::ng-deep .loaderContainer .p-card {
        width: 100%;
        display: flex;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentListComponent implements OnInit {
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  students: WritableSignal<Student[]> = signal([]);
  loading: WritableSignal<boolean> = signal(true);

  selectedStudent!: Student;

  ngOnInit(): void {
    this.loading.set(true);
    this.http
      .get<Student[]>('/api/students')
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((students) => {
        this.students.set(students);
      });
  }

  addNewStudent(): void {
    this.router.navigate(['dashboard/add-student']);
  }
}
