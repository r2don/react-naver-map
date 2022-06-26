import type { IsFunction } from "./types";

export const isFunction: IsFunction = (value) => typeof value === "function";
