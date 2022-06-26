import React, { createContext, ReactNode, useContext } from "react";

type MapContext = naver.maps.Map | null;

const mapContext = createContext<MapContext>(null);

interface MapContextProviderProps {
  children: ReactNode;
  value: MapContext;
}

export const MapContextProvider = ({
  children,
  value,
}: MapContextProviderProps) => {
  return <mapContext.Provider value={value}>{children}</mapContext.Provider>;
};

/**
 * If you want to use `Maps` methods, you can use this.
 *
 * Make sure to use this inside of `map context` which provided by `Map` component
 */
export const useMapContext = () => {
  const map = useContext(mapContext);
  if (!map) throw new Error("map is not accessible");

  return map;
};
