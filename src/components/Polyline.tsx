import React, { useEffect, useRef } from "react";
import { useMapContext } from "../context";

interface PolylineProps {
  path: { latitude: number; longitude: number }[];
  strokeColor?: string;
  strokeWeight?: number;
  strokeOpacity?: number;
  strokeStyle?: naver.maps.strokeStyleType;
}

/**
 * Set polyline into Map obejct without rendering anything in VirtualDOM
 * @returns <></>
 */
const Polyline: React.FC<PolylineProps> = ({
  path,
  strokeColor = "#FF0000",
  strokeWeight = 4,
  strokeOpacity = 0.8,
  strokeStyle = "solid",
}: PolylineProps) => {
  const map = useMapContext();
  const polylineRef = useRef<naver.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    const polylinePath = path.map(
      (point) => new naver.maps.LatLng(point.latitude, point.longitude),
    );

    polylineRef.current = new naver.maps.Polyline({
      map,
      path: polylinePath,
      strokeColor,
      strokeWeight,
      strokeOpacity,
      strokeStyle: strokeStyle as naver.maps.strokeStyleType,
    });

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
      }
    };
  }, [map, path, strokeColor, strokeWeight, strokeOpacity, strokeStyle]);

  return <></>;
};

export default Polyline;
