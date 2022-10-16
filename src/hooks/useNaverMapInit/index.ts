import { useState } from "react";
import { isClientSide, isFunction } from "../../utils";
import { SCRIPT_ID } from "./constants";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import {
  insertNaverMapScriptIntoHead,
  createNaverMapScriptByClientId,
} from "./utils";
import type { InitResult, UseNaverMapInit } from "./types";

/**
 * Load naver map script with provided client id.
 *
 * `Map` component will automatically load script. But, if you want to load naver map script in advance, you can use this hook.
 *
 * @param onLoad - This function will triggered when loading script finished. If 'onLoad' changes too often, wrap that definition in useCallback
 * @param onError - This function will triggered when loading script failed. If 'onError' changes too often, wrap that definition in useCallback
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
      return;
    }
    if (document.getElementById(SCRIPT_ID)) return;

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
          reject({ isLoaded: false, isError: true });
        });
      });

      const result = await scriptInitResult;
      setInitResult(result);
    };

    initNaverMapScript();
  }, [ncpClientId]);

  useIsomorphicLayoutEffect(() => {
    if (onLoad && isFunction(onLoad) && isLoaded) {
      onLoad();
    }
    if (onError && isFunction(onError) && isError) {
      onError();
    }
  }, [isLoaded, isError, onLoad, onError]);

  return { isLoaded, isError };
};
