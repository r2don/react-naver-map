import type { EventHandlers } from "./type";

export const isEventHandlerKey = (key: string): key is keyof EventHandlers => {
  return key.startsWith("on");
};
