import { useMemo } from "react";
import { v4 } from "uuid";

export const useUUIDv4 = () => useMemo(() => v4(), []);
