export interface InitParams {
  ncpClientId: string;
  onLoad?: (...args: unknown[]) => unknown;
  onError?: (...args: unknown[]) => unknown;
}

export interface InitResult {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: InitParams) => InitResult;
