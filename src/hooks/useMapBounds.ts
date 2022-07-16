import { useEffect, useState } from "react";
import { useMapContext } from "../context";

export const useMapBounds = () => {
  const map = useMapContext();
  const [bounds, setBounds] = useState(map.getBounds());

  useEffect(() => {
    const onBoundsChange = () => {
      setBounds(map.getBounds());
    };
    const dragEnd = map.addListener("dragend", onBoundsChange);
    const zoomChanged = map.addListener("zoom_changed", onBoundsChange);
    return () => {
      map.removeListener([dragEnd, zoomChanged]);
    };
  }, [map]);

  return bounds;
};
