export interface InitParams {
  ncpClientId: string;
  submodules?: Submodule[]
  onLoad?: VoidFunction;
  onError?: VoidFunction;
}

export interface InitResult {
  isLoaded: boolean;
  isError: boolean;
}

export type UseNaverMapInit = (params: InitParams) => InitResult;

/**
 * naver map submodule
 * @link https://navermaps.github.io/maps.js.ncp/docs/tutorial-4-Submodules.html
 */
export type Submodule = "panorama" | "geocoder" | "drawing" | "visualization"