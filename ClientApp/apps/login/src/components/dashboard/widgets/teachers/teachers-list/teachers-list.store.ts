import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { httpResource, HttpResourceRef } from '@angular/common/http';
import { computed, inject } from '@angular/core';
import { of, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError } from 'rxjs/operators';
import { Teacher } from './teachers-list.model';
import { TeachersListService } from './teachers-list.service';

type TeachersListState = {
  teachersResource: HttpResourceRef<Teacher[]> | null;
  selectedTeacher: Teacher | null;
};

const initialState: TeachersListState = {
  teachersResource: null,
  selectedTeacher: null,
};

export const TeachersListStore = signalStore(
  withState(initialState),
  withComputed((store) => ({
    teachers: computed(() => store.teachersResource()?.value()),
    isLoading: computed(() => store.teachersResource()?.isLoading()),
  })),
  withMethods((store, teachersListService = inject(TeachersListService)) => ({
    getTeachers(): void {
      const teachersResource = httpResource<Teacher[]>(() => '/api/teachers', {
        defaultValue: [],
      });
      patchState(store, { teachersResource });
    },
    selectTeacher(selectedTeacher: Teacher): void {
      patchState(store, { selectedTeacher });
    },
    removeTeacher: rxMethod<string>(
      pipe(
        switchMap((teacherId) =>
          teachersListService.removeTeacher(teacherId).pipe(
            tap(() => {
              store.teachersResource()?.reload();
            }),
            catchError(() => of(null))
          )
        )
      )
    ),
  })),
  withHooks({
    onInit(store) {
      store.getTeachers();
    },
  })
);
