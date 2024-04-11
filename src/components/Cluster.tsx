import React, {
  Ref,
  cloneElement,
  isValidElement,
  useRef,
  type ReactElement,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClusterOptions, MarkerClustering } from "../classes";
import { useMapContext } from "../context";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import type { ArrayToUnion } from "../types";
import type { MarkerRef } from "./marker/type";

interface ClusterPropsOptions
  extends Omit<Partial<ClusterOptions>, "map" | "markers" | "icons"> {
  icons?: Array<ArrayToUnion<ClusterOptions["icons"]> | ReactElement>;
}

interface ClusterProps {
  children: Array<ReactElement<{ ref: Ref<MarkerRef> }>>;
  options?: ClusterPropsOptions;
}

export const Cluster = ({ children, options }: ClusterProps) => {
  const markersRef = useRef<Record<string, MarkerRef>>({});
  const clusterRef = useRef<MarkerClustering>();
  const map = useMapContext();

  useIsomorphicLayoutEffect(() => {
    import("../classes/MarkerClustering").then(({ MarkerClustering }) => {
      if (clusterRef.current) return;

      const icons = options?.icons?.map((icon) => {
        // ReactElement 타입(React.ReactElement<any, string | React.JSXElementConstructor<any>>)일 경우, HTML 문자열로 변환합니다.
        if (isValidElement<any>(icon)) {
          return {
            content: renderToStaticMarkup(icon),
          };
        }
        // 그 외 타입(string | naver.maps.ImageIcon | naver.maps.SymbolIcon | naver.maps.HtmlIcon)이면 그대로 반환합니다.
        return icon;
      });

      const cluster = new MarkerClustering({
        ...options,
        icons,
        map,
        markers: Object.values(markersRef.current)
          .filter((ref) => !!ref.getMarker)
          .map((ref) => ref.getMarker().marker) as naver.maps.Marker[],
      });

      clusterRef.current = cluster;
    });

    return () => {
      if (clusterRef.current) {
        clusterRef.current.onRemove();
        clusterRef.current = undefined;
        markersRef.current = {};
      }
    };
  }, [children, map, options]);

  return (
    <>
      {children.map((child) =>
        cloneElement(child, {
          ref: (ref: MarkerRef) => {
            const marker = ref?.getMarker?.();
            if (!marker) return;
            markersRef.current[marker.id] = ref;
          },
        }),
      )}
    </>
  );
};
