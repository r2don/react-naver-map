import type { AnyFunction } from "../../types";

export type IsFunction = <T = any>(
  value: AnyFunction | T | undefined,
) => boolean;
