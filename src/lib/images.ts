export function isRemoteImage(src: string) {
  return /^https?:\/\//.test(src);
}
