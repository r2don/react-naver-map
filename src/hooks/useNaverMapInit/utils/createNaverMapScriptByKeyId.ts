import { SCRIPT_ID } from "../constants";
import type { InitParams } from "../types";

export const createNaverMapScriptByKeyId = ({
  ncpKeyId,
  submodules,
}: Pick<InitParams, "ncpKeyId" | "submodules">) => {
  const script = document.createElement("script");
  let paramsString = `ncpKeyId=${ncpKeyId}`;

  if (submodules?.length) {
    paramsString = paramsString.concat(`&submodules=${submodules.join(",")}`);
  }

  script.id = SCRIPT_ID;
  script.type = "text/javascript";
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${paramsString}`;

  return script;
};
