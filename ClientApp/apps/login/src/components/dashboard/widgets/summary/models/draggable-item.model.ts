export interface DraggableItem {
  id: string;
  name: string;
  layout?: ItemLayout;
  children: DraggableItem[];
}

export interface ItemLayout {
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colEnd: number;
}
