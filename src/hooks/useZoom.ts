import { useCallback } from "react";
import { useMapContext } from "..";

/**
 * A hook to handle zoom level of map
 *
 * If you want to make custom zoom level controls, this is the hook you need
 *
 * Make sure to use this hook inside of Map context
 */
export const useZoom = () => {
  const map = useMapContext();

  const zoomIn = useCallback(() => {
    map.setZoom(map.getZoom() + 1);
  }, [map]);

  const zoomOut = useCallback(() => {
    map.setZoom(map.getZoom() - 1);
  }, [map]);

  return { zoomIn, zoomOut, setZoom: map.setZoom };
};
