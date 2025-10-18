import {
  AfterViewInit,
  Component,
  computed,
  input,
  model,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragMove,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { DraggableItem, ItemLayout } from '../models/draggable-item.model';

@Component({
  imports: [CommonModule, MenuModule, CdkDragHandle, CdkDropList, CdkDrag],
  selector: 'app-drag-item',
  styleUrl: './drag-item.component.less',
  templateUrl: './drag-item.component.html',
  host: {
    class: 'drag-item-host',
  },
})
export class DragItemComponent implements OnInit, AfterViewInit {
  items = input.required<DraggableItem[]>();
  rows = input.required<number>();
  cols = input.required<number>();
  rowsHeight = model<number>(100);
  colsWidth = model<number>(100);
  minRowHeight = input<number>(50);
  maxRowHeight = input<number>(200);
  minColWidth = input<number>(50);
  maxColWidth = input<number>(200);
  computedRowHeight = computed(() =>
    Math.min(
      Math.max(this.rowsHeight(), this.minRowHeight()),
      this.maxRowHeight()
    )
  );
  computedColWidth = computed(() =>
    Math.min(Math.max(this.colsWidth(), this.minColWidth()), this.maxColWidth())
  );
  itemsToMove: Set<DraggableItem> = new Set();
  @ViewChild(CdkDrag) dragRef?: CdkDrag;
  private gridState: boolean[][] = [];

  ngOnInit() {
    this.initializeGridState();
    this.initializeItemLayouts();
  }

  ngAfterViewInit() {
    if (this.dragRef) {
      this.dragRef.previewClass = 'cdk-drag-preview-hidden';
    }
  }

  onDrop(event: CdkDragDrop<DraggableItem[]>) {
    this.itemsToMove.clear();
    const item = event.item.data as DraggableItem;
    if (!item) return;

    const dropPoint = event.dropPoint;
    if (!dropPoint) return;

    const containerRect =
      event.container.element.nativeElement.getBoundingClientRect();

    // Calculate the grid position relative to the container
    const relativeX = dropPoint.x - containerRect.left;
    const relativeY = dropPoint.y - containerRect.top;

    // Convert to grid coordinates (1-based)
    const targetCol = Math.max(
      1,
      Math.ceil(relativeX / this.computedColWidth())
    );
    const targetRow = Math.max(
      1,
      Math.ceil(relativeY / this.computedRowHeight())
    );

    // Unmark current position
    if (item.layout) {
      this.markGridCells(item.layout, false);
    }

    // Get dimensions from current layout or use defaults
    const width = item.layout
      ? (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1)
      : 1;
    const height = item.layout
      ? (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1)
      : 1;

    // Place item at target position
    item.layout = {
      rowStart: targetRow,
      rowEnd: targetRow + height,
      colStart: targetCol,
      colEnd: targetCol + width,
    };

    // Find and move conflicting items
    this.resolveConflicts(item);

    // Update grid state
    this.initializeGridState();
  }

  onResize(
    dimension: 'row' | 'col' | 'both',
    event: MouseEvent,
    item?: DraggableItem
  ) {
    if (!item?.layout) return;

    event.preventDefault();
    const startX = event.pageX;
    const startY = event.pageY;
    const originalLayout = { ...item.layout };

    const onMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      this.markGridCells(item.layout!, false);

      const deltaX = moveEvent.pageX - startX;
      const deltaY = moveEvent.pageY - startY;
      const newLayout = { ...item.layout! };

      if (dimension === 'both' || dimension === 'col') {
        const deltaCols = Math.round(deltaX / this.computedColWidth());
        const newWidth = Math.max(
          1,
          (originalLayout.colEnd ?? 2) -
            (originalLayout.colStart ?? 1) +
            deltaCols
        );
        newLayout.colEnd = (newLayout.colStart ?? 1) + newWidth;
      }

      if (dimension === 'both' || dimension === 'row') {
        const deltaRows = Math.round(deltaY / this.computedRowHeight());
        const newHeight = Math.max(
          1,
          (originalLayout.rowEnd ?? 2) -
            (originalLayout.rowStart ?? 1) +
            deltaRows
        );
        newLayout.rowEnd = (newLayout.rowStart ?? 1) + newHeight;
      }

      // Sprawdź, czy nowy rozmiar mieści się w granicach siatki
      if (
        this.canFitItem(
          newLayout.rowStart ?? 1,
          newLayout.colStart ?? 1,
          (newLayout.colEnd ?? 2) - (newLayout.colStart ?? 1),
          (newLayout.rowEnd ?? 2) - (newLayout.rowStart ?? 1),
          item
        )
      ) {
        item.layout = newLayout;
        this.markGridCells(newLayout, true);
        this.rearrangeOverlappingItems(item);
      } else {
        this.markGridCells(originalLayout, true);
      }
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  onDragStarted() {
    this.itemsToMove.clear();
  }

  onDragMoved(event: CdkDragMove<DraggableItem>) {
    const item = event.source.data as DraggableItem;
    if (!item || !event.pointerPosition) return;

    const containerRect =
      event.source.dropContainer.element.nativeElement.getBoundingClientRect();
    const relativeX = event.pointerPosition.x - containerRect.left;
    const relativeY = event.pointerPosition.y - containerRect.top;

    const targetCol = Math.max(
      1,
      Math.ceil(relativeX / this.computedColWidth())
    );
    const targetRow = Math.max(
      1,
      Math.ceil(relativeY / this.computedRowHeight())
    );

    // Aktualizuj wizualne wskaźniki
    this.updateDragPreview(item, targetRow, targetCol);
    this.previewMoveConflicts(item, targetRow, targetCol);
    this.updateAffectedItems();
  }

  onDragEnded() {
    const preview = document.querySelector('.drop-preview');
    if (preview) {
      preview.remove();
    }
    this.itemsToMove.clear();
    this.updateAffectedItems();
  }

  private updateDragPreview(
    item: DraggableItem,
    targetRow: number,
    targetCol: number
  ) {
    let preview = document.querySelector('.drop-preview') as HTMLElement;
    if (!preview) {
      preview = document.createElement('div');
      preview.className = 'drop-preview';
      const container = document.querySelector('.grid-container');
      container?.appendChild(preview);
    }

    const width = item.layout
      ? (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1)
      : 1;
    const height = item.layout
      ? (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1)
      : 1;

    preview.style.left = `${(targetCol - 1) * this.computedColWidth()}px`;
    preview.style.top = `${(targetRow - 1) * this.computedRowHeight()}px`;
    preview.style.width = `${width * this.computedColWidth()}px`;
    preview.style.height = `${height * this.computedRowHeight()}px`;
  }

  private updateAffectedItems() {
    // Usuń poprzednie oznaczenia
    const items = this.items();
    items.forEach((item) => {
      const element = document.querySelector(
        `[data-item-id="${item.id}"]`
      ) as HTMLElement;
      if (element) {
        element.classList.remove('will-move');
      }
    });

    // Dodaj oznaczenia do elementów, które będą przesunięte
    this.itemsToMove.forEach((item) => {
      const element = document.querySelector(
        `[data-item-id="${item.id}"]`
      ) as HTMLElement;
      if (element) {
        element.classList.add('will-move');
      }
    });
  }

  private resolveConflicts(movedItem: DraggableItem) {
    let hasChanges = true;
    let iterations = 0;
    const maxIterations = this.rows() * this.cols();

    while (hasChanges && iterations < maxIterations) {
      hasChanges = false;
      iterations++;

      for (const item of this.items()) {
        if (item === movedItem || !item.layout || !movedItem.layout) continue;

        if (this.itemsOverlap(item, movedItem)) {
          const width = (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1);
          const height =
            (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1);
          let newPosition: ItemLayout | null = null;

          const colStart = item.layout.colStart ?? 1;
          if (colStart + width <= this.cols()) {
            newPosition = {
              rowStart: item.layout.rowStart ?? 1,
              rowEnd: item.layout.rowEnd ?? 2,
              colStart: movedItem.layout.colEnd ?? 2,
              colEnd: (movedItem.layout.colEnd ?? 2) + width,
            };
          }

          if (
            !newPosition ||
            !this.canFitItem(
              newPosition.rowStart,
              newPosition.colStart,
              width,
              height,
              item
            )
          ) {
            newPosition = {
              rowStart: movedItem.layout.rowEnd ?? 2,
              rowEnd: (movedItem.layout.rowEnd ?? 2) + height,
              colStart: item.layout.colStart ?? 1,
              colEnd: item.layout.colEnd ?? 2,
            };
          }

          if (
            this.canFitItem(
              newPosition.rowStart,
              newPosition.colStart,
              width,
              height,
              item
            )
          ) {
            item.layout = newPosition;
            hasChanges = true;
          }
        }
      }
    }
  }

  private itemsOverlap(item1: DraggableItem, item2: DraggableItem): boolean {
    if (!item1.layout || !item2.layout) return false;

    const r1s = item1.layout.rowStart ?? 1;
    const r1e = item1.layout.rowEnd ?? 2;
    const c1s = item1.layout.colStart ?? 1;
    const c1e = item1.layout.colEnd ?? 2;

    const r2s = item2.layout.rowStart ?? 1;
    const r2e = item2.layout.rowEnd ?? 2;
    const c2s = item2.layout.colStart ?? 1;
    const c2e = item2.layout.colEnd ?? 2;

    return !(r1e <= r2s || r2e <= r1s || c1e <= c2s || c2e <= c1s);
  }

  private initializeGridState() {
    this.gridState = Array(this.rows())
      .fill(false)
      .map(() => Array(this.cols()).fill(false));

    this.items().forEach((item) => {
      if (item.layout) {
        this.markGridCells(item.layout, true);
      }
    });
  }

  private initializeItemLayouts() {
    this.items().forEach((item, index) => {
      if (!item.layout) {
        const row = Math.floor(index / this.cols()) + 1;
        const col = (index % this.cols()) + 1;
        item.layout = {
          rowStart: row,
          rowEnd: row + 1,
          colStart: col,
          colEnd: col + 1,
        };
      }
    });
  }

  private markGridCells(layout: DraggableItem['layout'], value: boolean) {
    if (!layout) return;

    const rowStart = layout.rowStart ?? 1;
    const rowEnd = layout.rowEnd ?? rowStart + 1;
    const colStart = layout.colStart ?? 1;
    const colEnd = layout.colEnd ?? colStart + 1;

    for (let r = rowStart; r < rowEnd; r++) {
      for (let c = colStart; c < colEnd; c++) {
        if (r < this.rows() && c < this.cols()) {
          this.gridState[r][c] = value;
        }
      }
    }
  }

  private findAvailablePosition(
    item: DraggableItem,
    targetRow: number,
    targetCol: number
  ) {
    const currentLayout = item.layout ?? {
      rowStart: 1,
      rowEnd: 2,
      colStart: 1,
      colEnd: 2,
    };

    const height = (currentLayout.rowEnd ?? 2) - (currentLayout.rowStart ?? 1);
    const width = (currentLayout.colEnd ?? 2) - (currentLayout.colStart ?? 1);

    // Try target position first
    if (this.canFitItem(targetRow, targetCol, width, height, item)) {
      return {
        rowStart: targetRow,
        rowEnd: targetRow + height,
        colStart: targetCol,
        colEnd: targetCol + width,
      };
    }

    // Try moving right in the same row
    for (let c = targetCol + 1; c <= this.cols() - width + 1; c++) {
      if (this.canFitItem(targetRow, c, width, height, item)) {
        return {
          rowStart: targetRow,
          rowEnd: targetRow + height,
          colStart: c,
          colEnd: c + width,
        };
      }
    }

    // If no space in the same row, try next rows
    for (let r = targetRow + 1; r <= this.rows() - height + 1; r++) {
      // First try at the original column
      if (this.canFitItem(r, targetCol, width, height, item)) {
        return {
          rowStart: r,
          rowEnd: r + height,
          colStart: targetCol,
          colEnd: targetCol + width,
        };
      }

      // Then try all positions to the right in this row
      for (let c = 1; c <= this.cols() - width + 1; c++) {
        if (this.canFitItem(r, c, width, height, item)) {
          return {
            rowStart: r,
            rowEnd: r + height,
            colStart: c,
            colEnd: c + width,
          };
        }
      }
    }

    // If no space found, return the original position
    return currentLayout;
  }

  private canFitItem(
    row: number,
    col: number,
    width: number,
    height: number,
    excludeItem?: DraggableItem
  ): boolean {
    // Check grid boundaries
    if (
      row < 1 ||
      col < 1 ||
      row + height > this.rows() + 1 ||
      col + width > this.cols() + 1
    ) {
      return false;
    }

    // Check for overlapping items
    for (let r = row; r < row + height; r++) {
      for (let c = col; c < col + width; c++) {
        const occupyingItem = this.items().find(
          (item) =>
            item !== excludeItem &&
            item.layout &&
            r >= (item.layout.rowStart ?? 1) &&
            r < (item.layout.rowEnd ?? 2) &&
            c >= (item.layout.colStart ?? 1) &&
            c < (item.layout.colEnd ?? 2)
        );

        if (occupyingItem) {
          return false;
        }
      }
    }
    return true;
  }

  private rearrangeOverlappingItems(movedItem: DraggableItem) {
    let hasChanges = true;
    while (hasChanges) {
      hasChanges = false;
      for (const item of this.items()) {
        if (item === movedItem || !item.layout) continue;

        const width = (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1);
        const height = (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1);

        if (
          !this.canFitItem(
            item.layout.rowStart ?? 1,
            item.layout.colStart ?? 1,
            width,
            height,
            item
          )
        ) {
          this.markGridCells(item.layout, false);

          const newLayout = this.findAvailablePosition(
            item,
            (item.layout.rowStart ?? 1) + 1,
            item.layout.colStart ?? 1
          );

          if (JSON.stringify(newLayout) !== JSON.stringify(item.layout)) {
            item.layout = newLayout;
            hasChanges = true;
          }

          this.markGridCells(newLayout, true);
        }
      }
    }
  }

  private previewMoveConflicts(
    item: DraggableItem,
    targetRow: number,
    targetCol: number
  ) {
    this.itemsToMove.clear();

    if (!item.layout) return;

    const width = (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1);
    const height = (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1);

    const previewLayout: ItemLayout = {
      rowStart: targetRow,
      rowEnd: targetRow + height,
      colStart: targetCol,
      colEnd: targetCol + width,
    };

    // Find items that would be affected
    for (const otherItem of this.items()) {
      if (otherItem === item || !otherItem.layout) continue;

      const otherLayout: ItemLayout = {
        rowStart: otherItem.layout.rowStart ?? 1,
        rowEnd: otherItem.layout.rowEnd ?? 2,
        colStart: otherItem.layout.colStart ?? 1,
        colEnd: otherItem.layout.colEnd ?? 2,
      };

      if (this.layoutsOverlap(previewLayout, otherLayout)) {
        this.itemsToMove.add(otherItem);

        const newPosition = this.findNewPosition(otherItem, previewLayout);
        this.findAffectedItems(otherItem, newPosition);
      }
    }
  }

  private findNewPosition(
    item: DraggableItem,
    conflictLayout: ItemLayout
  ): ItemLayout {
    const width = (item.layout?.colEnd ?? 2) - (item.layout?.colStart ?? 1);
    const height = (item.layout?.rowEnd ?? 2) - (item.layout?.rowStart ?? 1);
    const colStart = item.layout?.colStart ?? 1;

    if (colStart + width <= this.cols()) {
      return {
        rowStart: item.layout?.rowStart ?? 1,
        rowEnd: item.layout?.rowEnd ?? 2,
        colStart: conflictLayout.colEnd,
        colEnd: conflictLayout.colEnd + width,
      };
    }

    return {
      rowStart: conflictLayout.rowEnd,
      rowEnd: conflictLayout.rowEnd + height,
      colStart: item.layout?.colStart ?? 1,
      colEnd: item.layout?.colEnd ?? 2,
    };
  }

  private findAffectedItems(
    item: DraggableItem,
    newPosition: ItemLayout
  ): void {
    for (const otherItem of this.items()) {
      if (
        otherItem === item ||
        !otherItem.layout ||
        this.itemsToMove.has(otherItem)
      ) {
        continue;
      }

      const otherLayout: ItemLayout = {
        rowStart: otherItem.layout.rowStart ?? 1,
        rowEnd: otherItem.layout.rowEnd ?? 2,
        colStart: otherItem.layout.colStart ?? 1,
        colEnd: otherItem.layout.colEnd ?? 2,
      };

      if (this.layoutsOverlap(newPosition, otherLayout)) {
        this.itemsToMove.add(otherItem);
        const nextPosition = this.findNewPosition(otherItem, newPosition);
        this.findAffectedItems(otherItem, nextPosition);
      }
    }
  }

  private layoutsOverlap(layout1: ItemLayout, layout2: ItemLayout): boolean {
    const layout2Start = layout2.rowStart;
    const layout2End = layout2.rowEnd;
    const layout2ColStart = layout2.colStart;
    const layout2ColEnd = layout2.colEnd;

    return !(
      layout1.rowEnd <= layout2Start ||
      layout2End <= layout1.rowStart ||
      layout1.colEnd <= layout2ColStart ||
      layout2ColEnd <= layout1.colStart
    );
  }
}
