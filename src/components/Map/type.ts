import { CSSProperties, ReactElement } from "react";
import { LatLng } from "src/interfaces/LatLng";

export interface MapProps extends naver.maps.MapOptions {
  center: LatLng;
  zoom?: number;
  children?: ReactElement;
  className?: string;
  style?: CSSProperties;
}
