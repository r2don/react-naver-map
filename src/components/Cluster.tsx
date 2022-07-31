import React, { cloneElement, ReactElement, Ref, useRef } from "react";
import { useMapContext } from "../context";
import { ClusterOptions, MarkerClustering } from "../classes";
import { useIsomorphicLayoutEffect } from "../hooks/useIsomorphicLayoutEffect";
import type { MarkerRef } from "./marker/type";

interface ClusterProps {
  children: Array<ReactElement<{ ref: Ref<MarkerRef> }>>;
  options?: Omit<Partial<ClusterOptions>, "map" | "markers">;
}

export const Cluster = ({ children, options }: ClusterProps) => {
  const markersRef = useRef<Record<string, MarkerRef>>({});
  const clusterRef = useRef<MarkerClustering>();
  const map = useMapContext();

  useIsomorphicLayoutEffect(() => {
    import("../classes/MarkerClustering").then(({ MarkerClustering }) => {
      const cluster = new MarkerClustering({
        ...options,
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
