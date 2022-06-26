import { ReactElement } from "react";
import { ComponentBase } from "src/interfaces/ComponentBase";
import type { LatLng } from "src/interfaces/LatLng";

export interface MapProps extends naver.maps.MapOptions, ComponentBase {
  center: LatLng;
  children?: ReactElement;
}
