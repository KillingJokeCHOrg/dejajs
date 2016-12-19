import { Rect } from '../../common/core/graphics';

export interface IDejaTile {
  id?: string;
  type?: string;
  color?: string; 
  bounds?: Rect;
  l?: number; // computed -- do not modify
  t?: number; // computed -- do not modify
  r?: number; // computed -- do not modify
  b?: number; // computed -- do not modify
  dragging?: boolean;
  dropping?: boolean;
  expanded?: boolean;
  pressed?: boolean;
  selected?: boolean;
  templateModel?: any;
}
