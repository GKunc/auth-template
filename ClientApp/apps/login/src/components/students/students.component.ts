import { Component, OnInit, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  imports: [],
  selector: 'app-students',
  templateUrl: './students.component.html',
  providers: [],
})
export class StudentsComponennt implements OnInit {
  http: HttpClient = inject(HttpClient);

  private readonly _payments = signal([]);

  ngOnInit(): void {
    this.http
      .get('/api/students')
      .subscribe((students: any) => this._payments.set(students));
  }
}
