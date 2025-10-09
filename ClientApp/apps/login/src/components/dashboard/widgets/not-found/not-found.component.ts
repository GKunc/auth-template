import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-not-found',
  styleUrl: './not-found.component.less',
  templateUrl: './not-found.component.html',
})
export class NotFoundComponent {}
