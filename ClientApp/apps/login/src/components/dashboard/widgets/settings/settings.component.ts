import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';

@Component({
  imports: [MenuModule, RouterModule],
  selector: 'app-summary',
  styleUrl: './settings.component.less',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {}
