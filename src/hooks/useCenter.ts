import { useCallback } from "react";
import { LatLng } from "src/interfaces/LatLng";
import { useMapContext } from "..";

/**
 * A hook to handle map center position
 *
 * getCenter returns center coords
 *
 * setCenter takes center coords and sets it as map center
 *
 * panTo takes center coords and pan to it
 */
export const useCenter = () => {
  const map = useMapContext();

  const getCenter = useCallback(() => {
    return map.getCenter();
  }, [map]);

  const setCenter = useCallback(
    ({ latitude, longitude }: LatLng) => {
      map.setCenter(new naver.maps.LatLng(latitude, longitude));
    },
    [map],
  );

  const panTo = useCallback(() => {
    ({ latitude, longitude }: LatLng) => {
      map.setCenter(new naver.maps.LatLng(latitude, longitude));
    };
  }, [map]);

  return { getCenter, setCenter, panTo };
};
