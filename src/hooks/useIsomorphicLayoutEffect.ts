import { useEffect, useLayoutEffect } from "react";
import { isClientSide } from "../utils";

// internal
export const useIsomorphicLayoutEffect = isClientSide
  ? useLayoutEffect
  : useEffect;
