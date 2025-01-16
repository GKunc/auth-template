import {
  Component,
  WritableSignal,
  effect,
  inject,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
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
    email: new FormControl(null),
    phoneNumber: new FormControl(null),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
  });

  constructor() {
    effect(() => this.toggleLoadingState(this.loading()));
  }
  addNewStudent(): void {
    this.loading.set(true);
    this.http
      .post('/api/students/register', this.newStudentForm.value)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result) => {
        console.log(result);
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
