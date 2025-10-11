import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-summary',
  styleUrl: './teachers-list.component.less',
  templateUrl: './teachers-list.component.html',
})
export class TeachersListComponent {}
