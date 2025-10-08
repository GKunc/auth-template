import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-lessons',
  templateUrl: './lessons.component.html',
  providers: [],
})
export class LessonsComponennt implements OnInit {
  http: HttpClient = inject(HttpClient);

  lessons: WritableSignal<any> = signal(null);

  ngOnInit(): void {
    this.http
      .get('/api/lessons')
      .subscribe((lessons) => this.lessons.set(lessons));
  }
}
