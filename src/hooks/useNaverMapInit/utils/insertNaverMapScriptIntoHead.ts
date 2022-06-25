export const insertNaverMapScriptIntoHead = (script: HTMLScriptElement) => {
  const { head } = document;
  head.insertBefore(script, head.firstChild);
};
