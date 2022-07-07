import { ElementType, ReactElement } from "react";
import type {
  ComponentBase,
  KeyboardEvent,
  LatLng,
  MouseEvent,
  PointerEvent,
} from "../../interfaces";

interface EventHandlers {
  onClick?: (e: PointerEvent) => void;
  onDoubleClick?: (e: PointerEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onKeyUp?: (e: KeyboardEvent) => void;
  onZoomChange?: (zoom: number) => void;
  onDragStart?: (e: MouseEvent) => void;
  onDrag?: (e: MouseEvent) => void;
  onDragEnd?: (e: MouseEvent) => void;
  onMouseOut?: (e: MouseEvent) => void;
  onMouseMove?: (e: MouseEvent) => void;
  onMouseOver?: (e: MouseEvent) => void;
  onMouseDown?: (e: MouseEvent) => void;
  onMouseUp?: (e: MouseEvent) => void;
  onMouseWheel?: (e: MouseEvent) => void;
}

interface MapProps extends naver.maps.MapOptions, ComponentBase, EventHandlers {
  as?: ElementType;
  center: LatLng;
  children?: ReactElement;
}

export type { MapProps, EventHandlers };
