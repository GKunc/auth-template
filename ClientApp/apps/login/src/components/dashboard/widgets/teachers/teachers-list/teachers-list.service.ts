import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Teacher } from './teachers-list.model';

@Injectable({ providedIn: 'root' })
export class TeachersListService {
  private http: HttpClient = inject(HttpClient);

  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>('/api/teachers');
  }

  addTeacher(teacher: Partial<Teacher>): Observable<void> {
    return this.http.post<void>('/api/teachers', teacher);
  }

  updateTeacher(id: string, teacher: Partial<Teacher>): Observable<void> {
    return this.http.put<void>(`/api/teachers/${id}`, teacher);
  }

  removeTeacher(id: string): Observable<void> {
    return this.http.delete<void>(`/api/teachers/${id}`);
  }
}
