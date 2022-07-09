import { ReactElement } from "react";
import type { LatLng } from "../../interfaces/LatLng";
import type { Nullable } from "../../types";

export interface MarkerProps
  extends Omit<naver.maps.MarkerOptions, "position" | "map" | "clickable"> {
  position: LatLng;
  onClick?: () => void;
  reactIcon?: ReactElement;
}

export interface MarkerRef {
  getMarker: () => { marker: Nullable<naver.maps.Marker>; id: string };
}
