import { useMapContext } from "../context";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import type { LatLng } from "../interfaces/LatLng";

interface MarkerProps
  extends Omit<naver.maps.MarkerOptions, "position" | "map" | "clickable"> {
  position: LatLng;
  onClick?: () => void;
}
/**
 * A marker component for map
 *
 * You can customize this marker with icon prop, see more detail here {@link https://navermaps.github.io/maps.js.ncp/docs/naver.maps.Marker.html#toc37__anchor}
 */
export const Marker = ({
  position: { latitude, longitude },
  onClick,
  ...rest
}: MarkerProps) => {
  const map = useMapContext();

  useIsomorphicLayoutEffect(() => {
    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(latitude, longitude),
      clickable: !!onClick,
      ...rest,
    });

    let listener: naver.maps.MapEventListener;
    if (onClick) {
      listener = marker.addListener("click", onClick);
    }

    return () => {
      if (listener) {
        marker.removeListener(listener);
      }
      marker.setMap(null);
    };
  }, [latitude, longitude, map, rest]);

  return null;
};
