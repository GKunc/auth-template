import { computed, Injectable, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { DraggableItem, GridPosition, ItemLayout } from './drag-item.model';

@Injectable()
export class DragItemService {
  // Signals for reactive state management
  items = signal<DraggableItem[]>([]);
  collidingItems = signal<Set<DraggableItem>>(new Set());
  // Constants for grid dimensions
  private readonly GRID_ROWS = 10;
  rows = signal<number>(this.GRID_ROWS);
  computedRowHeight = computed(() => 100 / this.GRID_ROWS);
  private readonly GRID_COLS = 10;
  cols = signal<number>(this.GRID_COLS);
  // Computed signals for grid dimensions
  computedColWidth = computed(() => 100 / this.GRID_COLS);
  // Resize state
  private resizingItem: DraggableItem | null = null;
  private resizingElement: Element | null = null;
  private startX = 0;
  private startY = 0;
  private startWidthPx = 0;
  private startHeightPx = 0;
  private originalLayout: ItemLayout | null = null;

  private gridContainerRef: HTMLElement | null = null;

  private gridState: boolean[][] = [];

  /**
   * Initializes the drag item service with items
   * Always uses a fixed 10x10 grid
   */
  initialize(items: DraggableItem[]): void {
    this.items.set(items);
    this.rows.set(this.GRID_ROWS);
    this.cols.set(this.GRID_COLS);
    this.initializeItemLayouts(items, this.GRID_COLS);
    this.initializeGrid(this.GRID_ROWS, this.GRID_COLS);
    this.refreshGridState(items, this.GRID_ROWS, this.GRID_COLS);
  }

  /**
   * Sets the preview class for a drag element
   */
  setDragPreviewClass(
    dragElement: CdkDrag,
    className = 'cdk-drag-preview-hidden'
  ): void {
    if (dragElement) {
      dragElement.previewClass = className;
    }
  }

  /**
   * Clears the colliding items list
   */
  clearCollidingItems(): void {
    this.collidingItems.set(new Set());
  }

  /**
   * Starts the resize operation
   */
  startResize(
    event: MouseEvent,
    item: DraggableItem,
    gridContainer: HTMLElement | null
  ): void {
    event.stopPropagation();
    event.preventDefault();

    this.resizingItem = item;
    this.resizingElement = (event.target as HTMLElement).closest('.grid-item');
    this.gridContainerRef = gridContainer;
    this.originalLayout = item.layout ? { ...item.layout } : null;
    gridContainer?.classList.add('show-grid');

    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startWidthPx = this.resizingElement?.clientWidth ?? 0;
    this.startHeightPx = this.resizingElement?.clientHeight ?? 0;

    window.addEventListener('mousemove', this.handleResizeMove);
    window.addEventListener('mouseup', this.handleResizeEnd);
  }

  /**
   * Handles drop event and returns new layout
   */
  onDrop(
    event: CdkDragDrop<DraggableItem[]>,
    colWidth: number,
    rowHeight: number
  ): void {
    const item = event.item.data as DraggableItem;
    if (!this.isValidDropEvent(event)) return;

    const targetPosition = this.calculateTargetPosition(
      event,
      colWidth,
      rowHeight
    );
    const itemDimensions = this.getItemDimensions(item);

    // Constrain position to ensure item stays within bounds
    const constrainedPosition = this.constrainPosition(
      targetPosition,
      itemDimensions,
      this.GRID_ROWS,
      this.GRID_COLS
    );

    const newLayout = this.createLayout(constrainedPosition, itemDimensions);

    this.applyLayoutUpdate(newLayout, item);

    this.clearCollidingItems();
  }

  /**
   * Handles drag move event and updates colliding items
   */
  onDragMoved(
    event: CdkDragMove<DraggableItem>,
    draggedItem: DraggableItem
  ): void {
    const tempLayout = this.calculateLayoutFromDragMove(
      event,
      draggedItem,
      this.computedColWidth(),
      this.computedRowHeight()
    );

    if (!tempLayout) {
      this.clearCollidingItems();
      return;
    }

    const collidingItemsArray = this.getCollidingItems(
      this.items(),
      tempLayout,
      draggedItem
    );
    this.setCollidingItems(collidingItemsArray);
  }

  /**
   * Handles mouse move during resize
   */
  private handleResizeMove = (event: MouseEvent): void => {
    if (!this.resizingItem || !this.resizingElement || !this.gridContainerRef)
      return;

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;
    const newWidthPx = Math.max(32, this.startWidthPx + deltaX);
    const newHeightPx = Math.max(32, this.startHeightPx + deltaY);

    // Get container dimensions
    const containerWidth = this.gridContainerRef.clientWidth;
    const containerHeight = this.gridContainerRef.clientHeight;

    // Calculate grid unit size in pixels
    const colWidthPx = containerWidth / this.GRID_COLS;
    const rowHeightPx = containerHeight / this.GRID_ROWS;

    // Calculate what the new layout would be
    const gridUnits = this.pixelsToGridUnits(
      newWidthPx,
      newHeightPx,
      colWidthPx,
      rowHeightPx
    );

    gridUnits.width = Math.max(1, gridUnits.width);
    gridUnits.height = Math.max(1, gridUnits.height);

    if (!this.resizingItem.layout) return;

    // Constrain dimensions to prevent overflow
    const constrained = this.constrainDimensions(
      gridUnits.width,
      gridUnits.height,
      this.resizingItem.layout.colStart,
      this.resizingItem.layout.rowStart,
      this.GRID_ROWS,
      this.GRID_COLS
    );

    const proposedLayout: ItemLayout = {
      rowStart: this.resizingItem.layout.rowStart,
      rowEnd: this.resizingItem.layout.rowStart + constrained.height,
      colStart: this.resizingItem.layout.colStart,
      colEnd: this.resizingItem.layout.colStart + constrained.width,
    };

    // Check for collisions with the proposed layout
    const collidingItemsArray = this.getCollidingItems(
      this.items(),
      proposedLayout,
      this.resizingItem
    );

    // Update colliding items set to show red borders
    this.setCollidingItems(collidingItemsArray);

    // Apply visual resize using constrained dimensions
    const constrainedWidthPx = constrained.width * colWidthPx;
    const constrainedHeightPx = constrained.height * rowHeightPx;

    (
      this.resizingElement as HTMLElement
    ).style.width = `${constrainedWidthPx}px`;
    (
      this.resizingElement as HTMLElement
    ).style.height = `${constrainedHeightPx}px`;
  };

  /**
   * Handles mouse up to finalize resize
   */
  private handleResizeEnd = (): void => {
    if (this.resizingItem && this.resizingElement) {
      // Check if there are any collisions
      const hasCollision = this.collidingItems().size > 0;

      if (hasCollision) {
        // Restore original dimensions if there's a collision
        (this.resizingElement as HTMLElement).style.width = '';
        (this.resizingElement as HTMLElement).style.height = '';
      } else {
        // Finalize resize if no collision
        this.finalizeResize(
          this.resizingItem,
          this.resizingElement as HTMLElement
        );
      }
    }

    this.cleanupResize();
  };

  /**
   * Cleanup resize operation
   */
  private cleanupResize(): void {
    this.gridContainerRef?.classList.remove('show-grid');
    this.resizingItem = null;
    this.resizingElement = null;
    this.gridContainerRef = null;
    this.originalLayout = null;

    // Clear colliding items after resize completes
    this.clearCollidingItems();

    window.removeEventListener('mousemove', this.handleResizeMove);
    window.removeEventListener('mouseup', this.handleResizeEnd);
  }

  /**
   * Finalizes resize and updates layout
   */
  private finalizeResize(
    item: DraggableItem,
    resizingElement: HTMLElement
  ): void {
    if (!item.layout || !this.gridContainerRef) return;

    const containerWidth = this.gridContainerRef.clientWidth;
    const containerHeight = this.gridContainerRef.clientHeight;
    const colWidthPx = containerWidth / this.GRID_COLS;
    const rowHeightPx = containerHeight / this.GRID_ROWS;

    const gridUnits = this.pixelsToGridUnits(
      resizingElement.offsetWidth,
      resizingElement.offsetHeight,
      colWidthPx,
      rowHeightPx
    );

    gridUnits.width = Math.max(1, gridUnits.width);
    gridUnits.height = Math.max(1, gridUnits.height);

    const constrained = this.constrainDimensions(
      gridUnits.width,
      gridUnits.height,
      item.layout.colStart,
      item.layout.rowStart,
      this.GRID_ROWS,
      this.GRID_COLS
    );

    const newLayout: ItemLayout = {
      rowStart: item.layout.rowStart,
      rowEnd: item.layout.rowStart + constrained.height,
      colStart: item.layout.colStart,
      colEnd: item.layout.colStart + constrained.width,
    };

    this.applyLayoutUpdate(newLayout, item);

    resizingElement.style.width = '';
    resizingElement.style.height = '';
  }

  /**
   * Sets the colliding items
   */
  private setCollidingItems(items: DraggableItem[]): void {
    this.collidingItems.set(new Set(items));
  }

  /**
   * Validates if a drop event is valid
   */
  private isValidDropEvent(event: CdkDragDrop<DraggableItem[]>): boolean {
    return !!(event.item.data && event.dropPoint);
  }

  /**
   * Calculates the target grid position from a drop event
   */
  private calculateTargetPosition(
    event: CdkDragDrop<DraggableItem[]>,
    colWidthPercent: number,
    rowHeightPercent: number
  ): GridPosition {
    const containerRect =
      event.container.element.nativeElement.getBoundingClientRect();
    const dropPoint = event.dropPoint;
    if (!dropPoint) {
      return { col: 1, row: 1 };
    }

    const relativeX = dropPoint.x - containerRect.left;
    const relativeY = dropPoint.y - containerRect.top;

    // Calculate position based on percentage
    const colWidthPx = (containerRect.width * colWidthPercent) / 100;
    const rowHeightPx = (containerRect.height * rowHeightPercent) / 100;

    return {
      col: Math.max(1, Math.ceil(relativeX / colWidthPx)),
      row: Math.max(1, Math.ceil(relativeY / rowHeightPx)),
    };
  }

  /**
   * Constrains position to ensure item stays within grid bounds
   */
  private constrainPosition(
    position: GridPosition,
    dimensions: { width: number; height: number },
    rows: number,
    cols: number
  ): GridPosition {
    return {
      col: Math.min(position.col, cols - dimensions.width + 1),
      row: Math.min(position.row, rows - dimensions.height + 1),
    };
  }

  /**
   * Gets the dimensions (width and height) of an item in grid units
   */
  private getItemDimensions(item: DraggableItem): {
    width: number;
    height: number;
  } {
    if (!item.layout) {
      return { width: 1, height: 1 };
    }

    return {
      width: (item.layout.colEnd ?? 2) - (item.layout.colStart ?? 1),
      height: (item.layout.rowEnd ?? 2) - (item.layout.rowStart ?? 1),
    };
  }

  /**
   * Creates a new layout from position and dimensions
   */
  private createLayout(
    position: GridPosition,
    dimensions: { width: number; height: number }
  ): ItemLayout {
    return {
      colStart: position.col,
      colEnd: position.col + dimensions.width,
      rowStart: position.row,
      rowEnd: position.row + dimensions.height,
    };
  }

  /**
   * Calculates grid position and dimensions from a drag move event
   */
  private calculateLayoutFromDragMove(
    event: CdkDragMove<DraggableItem>,
    draggedItem: DraggableItem,
    colWidthPercent: number,
    rowHeightPercent: number
  ): ItemLayout | null {
    if (!draggedItem || !draggedItem.layout) return null;

    const pointer = event.pointerPosition;
    const gridRect =
      event.source.dropContainer.element.nativeElement.getBoundingClientRect();
    const relativeX = pointer.x - gridRect.left;
    const relativeY = pointer.y - gridRect.top;

    const colWidthPx = (gridRect.width * colWidthPercent) / 100;
    const rowHeightPx = (gridRect.height * rowHeightPercent) / 100;

    const col = Math.max(1, Math.ceil(relativeX / colWidthPx));
    const row = Math.max(1, Math.ceil(relativeY / rowHeightPx));
    const width =
      (draggedItem.layout.colEnd ?? 2) - (draggedItem.layout.colStart ?? 1);
    const height =
      (draggedItem.layout.rowEnd ?? 2) - (draggedItem.layout.rowStart ?? 1);

    // Constrain position to prevent out-of-bounds
    const constrainedPosition = this.constrainPosition(
      { col, row },
      { width, height },
      this.GRID_ROWS,
      this.GRID_COLS
    );

    return {
      colStart: constrainedPosition.col,
      colEnd: constrainedPosition.col + width,
      rowStart: constrainedPosition.row,
      rowEnd: constrainedPosition.row + height,
    };
  }

  /**
   * Gets all items that collide with the given layout
   */
  private getCollidingItems(
    items: DraggableItem[],
    layout: ItemLayout,
    excludeItem?: DraggableItem
  ): DraggableItem[] {
    return items.filter((other) => {
      if (other.id === excludeItem?.id || !other.layout) return false;
      return (
        layout.colStart < other.layout.colEnd &&
        layout.colEnd > other.layout.colStart &&
        layout.rowStart < other.layout.rowEnd &&
        layout.rowEnd > other.layout.rowStart
      );
    });
  }

  /**
   * Validates if a layout is within grid bounds
   */
  private isValidLayout(
    layout: ItemLayout,
    rows: number,
    cols: number
  ): boolean {
    return (
      layout &&
      layout.rowStart >= 1 &&
      layout.rowEnd <= rows + 1 &&
      layout.colStart >= 1 &&
      layout.colEnd <= cols + 1
    );
  }

  /**
   * Validates if a grid cell is within bounds
   */
  private isValidGridCell(
    row: number,
    col: number,
    rows: number,
    cols: number
  ): boolean {
    return row >= 0 && col >= 0 && row < rows && col < cols;
  }

  /**
   * Creates an empty grid state
   */
  private createEmptyGrid(rows: number, cols: number): boolean[][] {
    return Array(rows)
      .fill(false)
      .map(() => Array(cols).fill(false));
  }

  /**
   * Calculates initial layout for an item at given index
   */
  private calculateInitialLayout(index: number, cols: number): ItemLayout {
    const row = Math.floor(index / cols) + 1;
    const col = (index % cols) + 1;

    return {
      rowStart: row,
      rowEnd: row + 1,
      colStart: col,
      colEnd: col + 1,
    };
  }

  /**
   * Converts pixel dimensions to grid units
   */
  private pixelsToGridUnits(
    pixelWidth: number,
    pixelHeight: number,
    colWidthPx: number,
    rowHeightPx: number
  ): {
    width: number;
    height: number;
  } {
    return {
      width: Math.max(1, Math.round(pixelWidth / colWidthPx)),
      height: Math.max(1, Math.round(pixelHeight / rowHeightPx)),
    };
  }

  /**
   * Constrains new dimensions to grid bounds
   */
  private constrainDimensions(
    newWidth: number,
    newHeight: number,
    colStart: number,
    rowStart: number,
    rows: number,
    cols: number
  ): { width: number; height: number } {
    return {
      width: Math.min(newWidth, cols - colStart + 1),
      height: Math.min(newHeight, rows - rowStart + 1),
    };
  }

  /**
   * Initializes item layouts for items without layouts
   */
  private initializeItemLayouts(items: DraggableItem[], cols: number): void {
    items.forEach((item, index) => {
      if (!item.layout) {
        item.layout = this.calculateInitialLayout(index, cols);
      }
    });
  }

  /**
   * Handles item layout update with collision checking
   */
  private updateItemLayoutWithCollisionCheck(
    items: DraggableItem[],
    newLayout: ItemLayout,
    item: DraggableItem
  ): boolean {
    const colliding = this.getCollidingItems(items, newLayout, item);

    if (colliding.length > 0) {
      this.setCollidingItems(colliding);
      return false;
    }

    // Update item layout
    const itemIndex = items.findIndex((i) => i === item);
    if (itemIndex >= 0) {
      items[itemIndex] = { ...items[itemIndex], layout: newLayout };
    }

    this.clearCollidingItems();
    return true;
  }

  /**
   * Initializes the grid state for given dimensions
   */
  private initializeGrid(rows: number, cols: number): void {
    this.gridState = this.createEmptyGrid(rows, cols);
  }

  /**
   * Refreshes grid state based on current items
   */
  private refreshGridState(
    items: DraggableItem[],
    rows: number,
    cols: number
  ): void {
    this.gridState = this.createEmptyGrid(rows, cols);
    items.forEach((item) => {
      if (item.layout) {
        this.markGridCellsInternal(item.layout, true, rows, cols);
      }
    });
  }

  private applyLayoutUpdate(newLayout: ItemLayout, item: DraggableItem): void {
    const updated = this.updateItemLayoutWithCollisionCheck(
      this.items(),
      newLayout,
      item
    );

    if (updated) {
      this.refreshGridState(this.items(), this.GRID_ROWS, this.GRID_COLS);
      this.items.set([...this.items()]);
    }
  }

  /**
   * Ensures a grid row exists
   */
  private ensureGridCell(gridState: boolean[][], row: number): void {
    if (!gridState[row]) {
      gridState[row] = [];
    }
  }

  /**
   * Marks grid cells as occupied or free (internal method using service's gridState)
   */
  private markGridCellsInternal(
    layout: ItemLayout,
    value: boolean,
    rows: number,
    cols: number
  ): void {
    if (!this.isValidLayout(layout, rows, cols)) return;

    for (let row = layout.rowStart; row <= layout.rowEnd - 1; row++) {
      for (let col = layout.colStart; col <= layout.colEnd - 1; col++) {
        if (this.isValidGridCell(row - 1, col - 1, rows, cols)) {
          this.ensureGridCell(this.gridState, row - 1);
          this.gridState[row - 1][col - 1] = value;
        }
      }
    }
  }
}
