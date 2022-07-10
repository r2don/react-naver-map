import {
  PointerEvent as ReactPointerEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";

export interface PointerEvent {
  coord: naver.maps.Coord;
  point: naver.maps.Point;
  latlng: naver.maps.LatLng;
  offset: naver.maps.Point;
  originalEvent: ReactPointerEvent;
}

export interface MouseEvent extends Omit<PointerEvent, "originalEvent"> {
  originalEvent: ReactMouseEvent;
}

export interface KeyboardEvent {
  originalEvent: ReactKeyboardEvent;
}
