import {typeIsString, typeIsFalse} from "./TypeUtils";
import {randomString} from "./RandomUtils";

export const isBrowser = typeof window !== 'undefined';

export const isWeChat = typeof wx !== 'undefined' && typeIsFalse(isBrowser);

/**
 * 获取设备唯一Id
 */
export function generateDeviceId(): string {
  let result;

  if (isWeChat) {
    result = wx.getStorageSync('_JPSDKUniqueId');
    if (!typeIsString(result)) {
      result = randomString(16);
      wx.setStorageSync('_JPSDKUniqueId', result);
    }
  } else if (isBrowser) {
    result = localStorage.getItem('_JPSDKUniqueId');
    if (!typeIsString(result)) {
      result = randomString(16);
      localStorage.setItem('_JPSDKUniqueId', result);
    }
  }

  return result;
}

export function timeString(): string {
  const now = new Date(),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate(),
        h = now.getHours(),
        M = now.getMinutes(),
        s = now.getSeconds(),
        ms = now.getMilliseconds();
  function format(n: number, format: string) {
    const _n = n.toString();

    return format.slice(0, -_n.length) + _n;
  }

  return `${format(h, '00')}:${format(M, '00')}:${format(s, '00')}.${format(ms, '000')}`;
}
