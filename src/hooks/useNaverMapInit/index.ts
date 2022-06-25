import { useState } from "react";
import { isClientSide } from "src/utils";
import { SCRIPT_ID } from "./constants";
import { InitResult, UseNaverMapInit } from "./types";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import {
  insertNaverMapScriptIntoHead,
  createNaverMapScriptByClientId,
} from "./utils";

/**
 *
 * @param onLoad - If 'onLoad' changes too often, wrap that definition in useCallback
 * @param onError - If 'onError' changes too often, wrap that definition in useCallback
 */
export const useNaverMapInit: UseNaverMapInit = ({
  ncpClientId,
  onLoad,
  onError,
}) => {
  const [{ isLoaded, isError }, setInitResult] = useState<InitResult>({
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
      const scriptInitResult = new Promise<InitResult>((resolve, reject) => {
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
  }, [ncpClientId]);

  useIsomorphicLayoutEffect(() => {
    if (typeof onLoad === "function" && isLoaded) {
      onLoad();
    }
    if (typeof onError === "function" && isError) {
      onError();
    }
  }, [isLoaded, isError, onLoad, onError]);

  return { isLoaded, isError };
};
