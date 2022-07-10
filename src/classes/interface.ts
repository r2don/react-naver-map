import type { Nullable } from "../types";

export interface ClusterOptions {
  map: Nullable<naver.maps.Map>;
  markers: Array<naver.maps.Marker>;
  disableClickZoom: boolean;
  minClusterSize: number;
  maxZoom: number;
  gridSize: number;
  icons: Array<Parameters<naver.maps.Marker["setIcon"]>[0]>;
  indexGenerator: Array<number> | ((count: number) => number);
  averageCenter: boolean;
  stylingFunction: (clusterMarker: naver.maps.Marker, count: number) => void;
}

export type OptionKey = keyof ClusterOptions;
