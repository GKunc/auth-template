import {
  Component,
  WritableSignal,
  effect,
  inject,
  signal,
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
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

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
  http: HttpClient = inject(HttpClient);
  router: Router = inject(Router);

  loading: WritableSignal<boolean> = signal(false);

  newStudentForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.minLength(9),
      Validators.maxLength(9),
    ]),
    firstName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl(null, [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  constructor() {
    effect(() => this.toggleLoadingState(this.loading()));
  }

  addNewStudent(): void {
    this.loading.set(true);
    this.http
      .post('/api/students', this.newStudentForm.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe(() => {
        this.router.navigate(['/dashboard/student-list']);
      });
  }

  private toggleLoadingState(disable: boolean) {
    Object.keys(this.newStudentForm.controls).forEach((key) => {
      const control = this.newStudentForm.get(key);
      if (disable) {
        control?.disable();
      } else {
        control?.enable();
      }
    });
  }
}
