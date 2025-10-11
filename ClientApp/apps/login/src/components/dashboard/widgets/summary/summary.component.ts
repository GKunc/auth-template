import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-summary',
  styleUrl: './summary.component.less',
  templateUrl: './summary.component.html',
})
export class SummaryComponent {}
