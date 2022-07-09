import { entries } from "../../utils";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import type { Nullable, ValueOf } from "../../types";
import type { EventHandlers } from "./type";

export const useEventHandlers = (
  map: Nullable<naver.maps.Map>,
  eventHandlers: Partial<EventHandlers>,
) => {
  useIsomorphicLayoutEffect(() => {
    if (!map) return;

    const addListener = (
      key: string,
      handler: ValueOf<Required<EventHandlers>>,
    ) => {
      return naver.maps.Event.addListener(map, key, handler);
    };

    const events = entries(eventHandlers).map(([key, handler]) => {
      if (!handler) return;
      switch (key) {
        case "onDoubleClick":
          return addListener("dblclick", handler);
        case "onZoomChange":
          return addListener("zoom_changed", handler);
        default:
          return addListener(key.slice(2).toLowerCase(), handler);
      }
    });

    return () => {
      naver.maps.Event.removeListener(
        events.filter(
          (listener) => !!listener,
        ) as naver.maps.MapEventListener[],
      );
    };
  }, [map, eventHandlers]);
};
