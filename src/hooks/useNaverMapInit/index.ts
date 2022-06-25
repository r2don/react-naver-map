import { useState } from "react";
import { isClientSide } from "src/utils";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import { SCRIPT_ID } from "./constants";
import { Result, UseNaverMapInit } from "./types";
import {
  insertNaverMapScriptIntoHead,
  createNaverMapScriptByClientId,
} from "./utils";

export const useNaverMapInit: UseNaverMapInit = ({
  ncpClientId,
  onLoad,
  onError,
}) => {
  const [initResult, setInitResult] = useState<Result>({
    isLoaded: false,
    isError: false,
  });

  useIsomorphicLayoutEffect(() => {
    if (!isClientSide) {
      setInitResult({ isLoaded: false, isError: false });
    }
    if (document.getElementById(SCRIPT_ID)) {
      setInitResult({ isLoaded: true, isError: false });
    }

    const initNaverMapScript = async () => {
      const scriptInitResult = new Promise<Result>((resolve, reject) => {
        const script = createNaverMapScriptByClientId(ncpClientId);
        insertNaverMapScriptIntoHead(script);

        script.addEventListener("load", function () {
          console.info(`Initialized react-naver-map ${ncpClientId}`);
          resolve({ isLoaded: true, isError: false });
        });

        script.addEventListener("error", function () {
          console.warn(
            `Failed to initialize react-naver-map (${ncpClientId}).`,
          );
          reject({ islocked: false, isError: true });
        });
      });

      const result = await scriptInitResult;
      setInitResult(result);
    };

    initNaverMapScript();
  }, []);

  return initResult;
};
