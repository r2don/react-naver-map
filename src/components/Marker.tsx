import { useMapContext } from "src/context";
import { useIsomorphicLayoutEffect } from "src/hooks/useIsomorphicLayoutEffect";
import { LatLng } from "src/interfaces/LatLng";

interface MarkerProps
  extends Omit<naver.maps.MarkerOptions, "position" | "map" | "clickable"> {
  position: LatLng;
  onClick: () => void;
}

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

    const listener = marker.addListener("click", onClick);

    return () => {
      marker.removeListener(listener);
      marker.setMap(null);
    };
  }, [latitude, longitude, map]);

  return null;
};
