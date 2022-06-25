import React, { useMemo, useRef, useState } from "react";

import { MapContextProvider, useMapContext } from "src/context/mapContext";
import { useIsomorphicLayoutEffect } from "src/hooks/useIsomorphicLayoutEffect";
import { MapProps } from "./type";

export { useMapContext };

const INITIAL_LEVEL = 5;

export const Map = ({
  children,
  center: { latitude, longitude },
  zoom = INITIAL_LEVEL,
  className,
  style,
  ...rest
}: MapProps) => {
  const center = useRef(new window.naver.maps.LatLng(latitude, longitude));
  const ref = useRef<HTMLDivElement>(null);
  const init = useRef(false);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || init.current || map) return;
    init.current = true;
    setMap(
      new window.naver.maps.Map(ref.current, {
        center: center.current,
        zoom,
        ...rest,
      }),
    );
  }, []);

  const memoizedMap = useMemo(() => {
    return map;
  }, [map]);

  return (
    <div className={className} style={style} ref={ref}>
      <MapContextProvider value={memoizedMap}>
        {map && children}
      </MapContextProvider>
    </div>
  );
};
