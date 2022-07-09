import {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useImperativeHandle,
  useRef,
} from "react";
import { useMapContext } from "../../context";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useCustomIcon, useUUIDv4 } from "./hooks";
import type { MarkerProps, MarkerRef } from "./type";
import type { Nullable } from "../../types";

/**
 * A marker component for map
 *
 * You can customize this marker with icon prop, see more detail here {@link https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Marker.html#toc37__anchor}
 */
const MarkerBase: ForwardRefRenderFunction<MarkerRef, MarkerProps> = (
  {
    position: { latitude, longitude },
    onClick,
    icon,
    reactIcon,
    ...rest
  }: MarkerProps,
  ref,
) => {
  const map = useMapContext();
  const marker = useRef<Nullable<naver.maps.Marker>>(null);

  const id = useUUIDv4();
  const customIcon = useCustomIcon(icon, reactIcon);

  useImperativeHandle(ref, () => ({
    getMarker: () => ({ marker: marker.current, id }),
  }));

  useIsomorphicLayoutEffect(() => {
    marker.current = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(latitude, longitude),
      clickable: !!onClick,
      icon: customIcon,
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
  }, [latitude, longitude, map, onClick, customIcon, rest]);

  return null;
};

export const Marker = memo(forwardRef(MarkerBase));
