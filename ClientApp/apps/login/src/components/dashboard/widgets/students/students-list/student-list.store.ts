import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Student } from './student-list.model';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { StudentListService } from './student-list.service';
import { catchError } from 'rxjs/operators';

type StudentListState = {
  studentsResource: HttpResourceRef<Student[]> | null;
  selectedStudent: Student | null;
};

const initialState: StudentListState = {
  studentsResource: null,
  selectedStudent: null,
};

export const StudentListStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    students: computed(() => store.studentsResource()?.value()),
    isLoading: computed(() => store.studentsResource()?.isLoading()),
  })),
  withMethods((store, studentListService = inject(StudentListService)) => ({
    getStudents(): void {
      const studentsResource = httpResource<Student[]>(() => '/api/students', {
        defaultValue: [],
      });
      patchState(store, { studentsResource });
    },
    selectStudent(selectedStudent: Student): void {
      patchState(store, { selectedStudent });
    },
    removeStudent: rxMethod<string>(
      pipe(
        switchMap((studentId) =>
          studentListService.removeStudent(studentId).pipe(
            tap(() => {
              store.studentsResource()?.reload();
            }),
            catchError(() => of(null))
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.getStudents();
    },
  })
);
