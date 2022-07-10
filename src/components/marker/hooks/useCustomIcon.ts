import { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { MarkerProps } from "../type";

export const useCustomIcon = <T extends MarkerProps = MarkerProps>(
  icon: T["icon"],
  reactIcon: T["reactIcon"],
): T["icon"] => {
  if (icon && reactIcon)
    throw new Error("'icon' and 'reactIcon' cannot be used at the same time.");

  return useMemo(() => {
    if (!icon && !reactIcon) return;

    if (reactIcon)
      return {
        content: renderToStaticMarkup(reactIcon),
      };

    return icon;
  }, [icon, reactIcon]);
};
