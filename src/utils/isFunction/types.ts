import type { AnyFunction } from "src/types";

export type IsFunction = <T = any>(
  value: AnyFunction | T | undefined,
) => boolean;
