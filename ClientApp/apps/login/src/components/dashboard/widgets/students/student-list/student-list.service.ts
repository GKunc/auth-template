import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student-list.model';

@Injectable({ providedIn: 'root' })
export class StudentListService {
  private http: HttpClient = inject(HttpClient);

  removeStudent(id: string): Observable<void> {
    return this.http.delete<void>(`/api/students/${id}`);
  }

  updateStudent(id: string, student: Partial<Student>): Observable<void> {
    return this.http.put<void>(`/api/students/${id}`, student);
  }

  addStudent(student: Partial<Student>): Observable<void> {
    return this.http.post<void>('/api/students', student);
  }
}
