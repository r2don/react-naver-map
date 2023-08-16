import { SCRIPT_ID } from "../constants";
import type { InitParams } from "../types";

export const createNaverMapScriptByClientId = ({
  ncpClientId,
  submodules,
}: Pick<InitParams, "ncpClientId" | "submodules">) => {
  const script = document.createElement("script");
  let paramsString = `ncpClientId=${ncpClientId}`;

  if (submodules?.length) {
    paramsString = paramsString.concat(`&submodules=${submodules.join(",")}`);
  }

  script.id = SCRIPT_ID;
  script.type = "text/javascript";
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${ncpClientId}`;

  return script;
};
