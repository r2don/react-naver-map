import { AnyFunction } from "src/types";

export interface InitParams {
  ncpClientId: string;
  onLoad?: AnyFunction;
  onError?: AnyFunction;
}

export interface InitResult {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: InitParams) => InitResult;
