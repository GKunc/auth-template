import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  viewChild
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDragMove, CdkDropList } from '@angular/cdk/drag-drop';
import { DraggableItem } from './drag-item.model';
import { DragItemService } from './drag-item.service';

@Component({
  selector: 'app-drag-item',
  imports: [CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './drag-item.component.html',
  styleUrl: './drag-item.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DragItemService],
})
export class DragItemComponent implements AfterViewInit, OnDestroy {
  // Inputs
  itemsInput = input.required<DraggableItem[]>();
  isNested = input<boolean>(false);

  // Service injection - each component instance gets its own service
  readonly dragItemService = inject(DragItemService);

  // Expose service signals directly (single source of truth)
  readonly items = this.dragItemService.items;
  readonly collidingItems = this.dragItemService.collidingItems;
  readonly rows = this.dragItemService.rows;
  readonly cols = this.dragItemService.cols;

  // View children
  private dragRef = viewChild<CdkDrag>(CdkDrag);
  private gridContainer =
    viewChild<ElementRef<HTMLDivElement>>('gridContainer');

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      // Initialize service with current inputs (always 10x10 grid)
      this.dragItemService.initialize(this.itemsInput());
    });

    // Update grid cell sizes when container reference changes
    effect(() => {
      const container = this.gridContainer()?.nativeElement;
      if (container) {
        this.setupResizeObserver(container);
      }
    });
  }

  ngAfterViewInit(): void {
    const dragElement = this.dragRef();
    if (dragElement) {
      this.dragItemService.setDragPreviewClass(dragElement);
    }

    // Set initial grid cell sizes
    const container = this.gridContainer()?.nativeElement;
    if (container) {
      this.updateGridCellSizes(container);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  onDrop(event: CdkDragDrop<DraggableItem[]>): void {
    this.dragItemService.onDrop(
      event,
      this.dragItemService.computedColWidth(),
      this.dragItemService.computedRowHeight()
    );
  }

  onDragStarted(): void {
    this.dragItemService.clearCollidingItems();
  }

  onDragMoved(
    event: CdkDragMove<DraggableItem>,
    draggedItem: DraggableItem
  ): void {
    this.dragItemService.onDragMoved(event, draggedItem);
  }

  startResize(event: MouseEvent, item: DraggableItem): void {
    this.dragItemService.startResize(
      event,
      item,
      this.gridContainer()?.nativeElement ?? null
    );
  }

  private setupResizeObserver(container: HTMLElement): void {
    // Disconnect previous observer if exists
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    // Create new ResizeObserver to watch container size changes
    this.resizeObserver = new ResizeObserver(() => {
      this.updateGridCellSizes(container);
    });

    this.resizeObserver.observe(container);

    // Initial update
    this.updateGridCellSizes(container);
  }

  private updateGridCellSizes(container: HTMLElement): void {
    // Calculate fixed cell sizes based on container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const colWidthPx = containerWidth / this.cols();
    const rowHeightPx = containerHeight / this.rows();

    // Set CSS variables with pixel values
    container.style.setProperty('--col-width', `${colWidthPx}px`);
    container.style.setProperty('--row-height', `${rowHeightPx}px`);
  }
}
