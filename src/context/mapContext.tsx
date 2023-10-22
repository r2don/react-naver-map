import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface MapContext {
  map: naver.maps.Map | null;
  setMap: Dispatch<SetStateAction<naver.maps.Map | null>> | null;
}

export const mapContext = createContext<MapContext>({
  map: null,
  setMap: null,
});

interface MapContextProviderProps {
  children: ReactNode;
}

export const MapContextProvider = ({ children }: MapContextProviderProps) => {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  return (
    <mapContext.Provider value={{ map, setMap }}>
      {children}
    </mapContext.Provider>
  );
};

/**
 * If you want to use `Maps` methods, you can use this.
 *
 * Make sure to use this inside of `map context` which provided by `Map` component
 */
export const useMapContext = () => {
  const { map, setMap } = useContext(mapContext);
  if (!setMap) throw Error("MapContextProvider is required");

  return map;
};
