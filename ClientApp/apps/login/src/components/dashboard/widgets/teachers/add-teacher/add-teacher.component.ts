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
import { finalize } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Teacher } from '../teachers-list/teachers-list.model';
import { TeachersListService } from '../teachers-list/teachers-list.service';

@Component({
  imports: [
    CardModule,
    ReactiveFormsModule,
    InputGroup,
    InputGroupAddonModule,
    InputTextModule,
    ButtonModule,
  ],
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AddTeacherComponent {
  teacher = input<Teacher>();
  loading: WritableSignal<boolean> = signal(false);
  newTeacherForm: FormGroup = new FormGroup({
    firstName: new FormControl(this.teacher()?.firstName, [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl(this.teacher()?.lastName, [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl(this.teacher()?.email, [
      Validators.required,
      Validators.email,
    ]),
    phoneNumber: new FormControl(this.teacher()?.phoneNumber, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
  });

  private ref: DynamicDialogRef = inject(DynamicDialogRef);
  private teacherService: TeachersListService = inject(TeachersListService);

  constructor() {
    effect(() => {
      this.toggleLoadingState(this.loading());
      this.newTeacherForm.setValue({
        firstName: this.teacher()?.firstName,
        lastName: this.teacher()?.lastName,
        email: this.teacher()?.email,
        phoneNumber: this.teacher()?.phoneNumber,
      });
    });
  }

  saveTeacher(): void {
    this.loading.set(true);
    const data = this.newTeacherForm?.value;
    if (this.teacher() && this.teacher()?.id) {
      this.teacherService
        .updateTeacher(this.teacher()!.id, data)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(() => {
          this.ref.close();
        });
    } else {
      this.teacherService
        .addTeacher(data)
        .pipe(finalize(() => this.loading.set(false)))
        .subscribe(() => {
          this.ref.close();
        });
    }
  }

  private toggleLoadingState(disable: boolean) {
    Object.keys(this.newTeacherForm?.controls).forEach((key) => {
      const control = this.newTeacherForm?.get(key);
      if (disable) {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }
}
