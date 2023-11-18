export function getAssetsUrl(assetsName: string) {
  const pagepath = window.location.pathname
  return pagepath.replace(/\/e[ns]\//, '/').replace(/\/[^\/]*$/, '/') + assetsName
}
