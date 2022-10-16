import React, { createElement as e, useMemo, useRef, useState } from "react";
import { entries } from "../../utils";
import { MapContextProvider } from "../../context/mapContext";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useEventHandlers } from "./useEventHandlers";
import { isEventHandlerKey } from "./utils";
import type { EventHandlers, MapProps } from "./type";

const INITIAL_LEVEL = 5;

/**
 * Rendering a naver map
 *
 * This component will take className as a prop, so that you can style this component using any styling libraries.(e.g. css, styled-components, etc.)
 *
 */
export const Map = ({
  as = "div",
  children,
  center = { latitude: 37.566535, longitude: 126.977969 },
  zoom = INITIAL_LEVEL,
  className,
  style,
  ...rest
}: MapProps) => {
  const { eventHandlers, mapOptions } = entries(rest).reduce(
    (acc, [key, value]) => {
      if (isEventHandlerKey(key)) {
        acc.eventHandlers[key] = value;
      } else {
        acc.mapOptions[key] = value;
      }
      return acc;
    },
    { mapOptions: {}, eventHandlers: {} } as {
      mapOptions: Partial<naver.maps.MapOptions>;
      eventHandlers: Partial<EventHandlers>;
    },
  );

  const { latitude, longitude } = center;

  const centerRef = useRef(new naver.maps.LatLng(latitude, longitude));
  const ref = useRef<HTMLDivElement>(null);
  const initializing = useRef(false);

  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [init, setInit] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || initializing.current) return;
    initializing.current = true;

    const map = new naver.maps.Map(ref.current, {
      center: centerRef.current,
      zoom,
      ...mapOptions,
    });

    const listener = map.addListener("init", () => setInit(true));
    setMap(map);

    return () => {
      if (initializing.current) {
        initializing.current = false;
        return;
      }
      map.removeListener(listener);
      map.destroy();
    };
  }, []);

  const memoizedMap = useMemo(() => map, [map]);

  useEventHandlers(map, eventHandlers);

  return e(
    as,
    { className, style, ref },
    <MapContextProvider value={memoizedMap}>
      {init && map && children}
    </MapContextProvider>,
  );
};
