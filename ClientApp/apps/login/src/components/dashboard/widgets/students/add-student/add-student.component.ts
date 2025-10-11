import {
  Component,
  effect,
  inject,
  input,
  signal,
  WritableSignal,
} from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { Student } from '../student-list/student-list.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { StudentListService } from '../student-list/student-list.service';

@Component({
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
  ],
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AddStudentComponent {
  student = input<Student>();
  loading: WritableSignal<boolean> = signal(false);
  newStudentForm: FormGroup = new FormGroup({
    firstName: new FormControl(this.student()?.firstName, [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl(this.student()?.lastName, [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(this.student()?.email, [
      Validators.required,
      Validators.email,
    ]),
    phoneNumber: new FormControl(this.student()?.phoneNumber, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
  });

  private http: HttpClient = inject(HttpClient);
  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private studentService: StudentListService = inject(StudentListService);

  constructor() {
    effect(() => {
      this.toggleLoadingState(this.loading());
      this.newStudentForm.setValue({
        firstName: this.student()?.firstName,
        lastName: this.student()?.lastName,
        email: this.student()?.email,
        phoneNumber: this.student()?.phoneNumber,
      });
    });
  }

  saveStudent(): void {
    this.loading.set(true);
    const studentData = this.newStudentForm?.value;
    if (this.student() && this.student()?.id) {
      this.studentService
        .updateStudent(this.student()!.id, studentData)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(() => {
          this.ref.close();
        });
    } else {
      this.studentService
        .addStudent(studentData)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(() => {
          this.ref.close();
        });
    }
  }

  private toggleLoadingState(disable: boolean) {
    Object.keys(this.newStudentForm?.controls).forEach((key) => {
      const control = this.newStudentForm?.get(key);
      if (disable) {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }
}
