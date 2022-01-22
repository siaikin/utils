import {isBrowser, isWeChat} from "./PlatformUtils";

export function sizeOf(str: string): number {
  str = str.toString();

  let result = 0;
  if (isBrowser) {
    result = new Blob([str], {type: 'text/plain'}).size;
  } else if (isWeChat) {
    result = str.length;
  }

  return result;
}
