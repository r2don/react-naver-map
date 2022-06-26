export interface InitParams {
  ncpClientId: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface InitResult {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: InitParams) => InitResult;
