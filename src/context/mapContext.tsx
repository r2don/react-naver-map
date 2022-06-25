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

export const useMapContext = () => {
  const map = useContext(mapContext);
  if (!map) throw new Error("map is not accessible");

  return map;
};
