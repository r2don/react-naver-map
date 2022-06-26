import { PositionKey, POSITION_MAP } from "src/constants";
import { useMapContext } from "src/context";
import { useIsomorphicLayoutEffect } from "src/hooks/useIsomorphicLayoutEffect";

const ZOOM_SIZE = {
  LARGE: 1,
  SMALL: 2,
} as const;

interface ZoomControlProps {
  position: PositionKey;
  size: keyof typeof ZOOM_SIZE;
  legendDisabled: boolean;
}

export const ZoomControl = ({
  position,
  size,
  legendDisabled,
}: ZoomControlProps) => {
  const map = useMapContext();

  useIsomorphicLayoutEffect(() => {
    const control = new naver.maps.ZoomControl({
      position: POSITION_MAP[position],
      style: ZOOM_SIZE[size],
      legendDisabled,
    });

    control.setMap(map);
    return () => {
      control.setMap(null);
    };
  }, [map, size, position, legendDisabled]);

  return null;
};
