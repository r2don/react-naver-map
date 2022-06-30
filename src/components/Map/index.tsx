import React, { useMemo, useRef, useState } from "react";

import { MapContextProvider } from "../../context/mapContext";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import type { MapProps } from "./type";

const INITIAL_LEVEL = 5;
const DEFAULT_STYLE = { width: "100%", height: "100%" };

/**
 * Rendering a naver map
 *
 * This component will take className as a prop, so that you can style this component using any styling libraries.(e.g. css, styled-components, etc.)
 *
 */
export const Map = ({
  children,
  center: { latitude, longitude },
  zoom = INITIAL_LEVEL,
  className,
  style,
  ...rest
}: MapProps) => {
  const center = useRef(new naver.maps.LatLng(latitude, longitude));
  const ref = useRef<HTMLDivElement>(null);
  const initializing = useRef(false);

  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [init, setInit] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || initializing.current) return;
    initializing.current = true;

    const map = new naver.maps.Map(ref.current, {
      center: center.current,
      zoom,
      ...rest,
    });
    map.addListener("init", () => setInit(true));
    setMap(map);
  }, []);

  const memoizedMap = useMemo(() => {
    return map;
  }, [map]);

  return (
    <div className={className} style={{ ...DEFAULT_STYLE, ...style }} ref={ref}>
      <MapContextProvider value={memoizedMap}>
        {init && map && children}
      </MapContextProvider>
    </div>
  );
};
