export interface InitParams {
  ncpClientId: string;
  onLoad?: VoidFunction;
  onError?: VoidFunction;
}

export interface InitResult {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: InitParams) => InitResult;
