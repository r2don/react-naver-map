import { useEffect, useLayoutEffect } from "react";
import { isClientSide } from "src/utils";

// internal
export const useIsomorphicLayoutEffect = isClientSide
  ? useLayoutEffect
  : useEffect;
