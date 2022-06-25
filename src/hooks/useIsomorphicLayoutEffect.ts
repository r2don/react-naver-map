import { useEffect, useLayoutEffect } from "react";

// internal
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
