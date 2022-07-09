import type { EventHandlers } from "./type";

const HANDLERS = {
  onClick: true,
  onDoubleClick: true,
  onKeyDown: true,
  onKeyUp: true,
  onZoomChange: true,
  onDragStart: true,
  onDrag: true,
  onDragEnd: true,
  onMouseOut: true,
  onMouseMove: true,
  onMouseOver: true,
  onMouseDown: true,
  onMouseUp: true,
  onMouseWheel: true,
};

export const isEventHandlerKey = (key: string): key is keyof EventHandlers => {
  return HANDLERS[key as keyof EventHandlers];
};
