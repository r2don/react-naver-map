import { SCRIPT_ID } from "../constants";
import type { InitParams } from "../types";

export const createNaverMapScriptByClientId = (
  ncpClientId: InitParams["ncpClientId"],
) => {
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "text/javascript";
  script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${ncpClientId}`;

  return script;
};
