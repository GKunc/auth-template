import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Student } from './student-list.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentListService {
  private http: HttpClient = inject(HttpClient);

  removeStudent(student: Student): Observable<void> {
    return this.http.delete<void>('/api/students', { body: student });
  }
}
