import { isClientSide } from "./isClientSide";

export const canUseEventListeners =
  isClientSide && Boolean(window.addEventListener);
