import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Nullable } from "src/types";
import { useMapContext } from "../context";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import type { LatLng } from "../interfaces/LatLng";

interface MarkerProps
  extends Omit<naver.maps.MarkerOptions, "position" | "map" | "clickable"> {
  position: LatLng;
  onClick?: () => void;
}

export interface MarkerRef {
  getMarker: () => { marker: Nullable<naver.maps.Marker>; id: string };
}

/**
 * A marker component for map
 *
 * You can customize this marker with icon prop, see more detail here {@link https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Marker.html#toc37__anchor}
 */
const MarkerBase: ForwardRefRenderFunction<MarkerRef, MarkerProps> = (
  { position: { latitude, longitude }, onClick, ...rest }: MarkerProps,
  ref,
) => {
  const map = useMapContext();
  const id = useMemo(() => `${new Date().toDateString()}_${Math.random()}`, []);

  const marker = useRef<Nullable<naver.maps.Marker>>(null);

  useImperativeHandle(ref, () => ({
    getMarker: () => ({ marker: marker.current, id }),
  }));

  useIsomorphicLayoutEffect(() => {
    marker.current = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(latitude, longitude),
      clickable: !!onClick,
      ...rest,
    });

    let listener: naver.maps.MapEventListener;
    if (onClick) {
      listener = marker.current.addListener("click", onClick);
    }

    return () => {
      if (!marker.current) return;
      if (listener) {
        marker.current.removeListener(listener);
      }
      marker.current.setMap(null);
      marker.current = null;
    };
  }, [latitude, longitude, map, rest]);

  return null;
};

export const Marker = forwardRef(MarkerBase);
