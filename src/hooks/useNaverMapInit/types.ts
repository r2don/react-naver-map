export interface Params {
  ncpClientId: string;
  onLoad?: () => void;
  onError?: () => void;
}

export interface Result {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: Params) => Result;
