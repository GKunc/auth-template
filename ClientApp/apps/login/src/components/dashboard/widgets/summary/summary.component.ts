import { Component } from '@angular/core';

import { MenuModule } from 'primeng/menu';
import { RouterModule } from '@angular/router';
import { DragItemComponent } from './drag-item/drag-item.component';
import { Divider } from 'primeng/divider';
import { DraggableItem } from './drag-item/drag-item.model';

@Component({
  imports: [MenuModule, RouterModule, DragItemComponent, Divider],
  selector: 'app-summary',
  styleUrl: './summary.component.less',
  templateUrl: './summary.component.html',
})
export class SummaryComponent {
  items: DraggableItem[] = [
    {
      id: '1',
      name: 'Item 1',
      layout: {
        colStart: 2,
        colEnd: 3,
        rowStart: 1,
        rowEnd: 3,
      },
    },
    {
      id: '2',
      name: 'Item 2',
      layout: {
        colStart: 2,
        colEnd: 3,
        rowStart: 3,
        rowEnd: 5,
      },
    },
    {
      id: '3',
      name: 'Item 3',
      children: [
        {
          id: '4',
          name: 'Item 3.1',
        },
        {
          id: '5',
          name: 'Item 3.2',
        },
      ],
    },
    {
      id: '6',
      name: 'Item 4',
    },
  ];
}
