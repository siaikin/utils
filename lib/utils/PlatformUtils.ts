import {typeIsString, typeIsFalse, typeIsFunction} from "./TypeUtils";
import {randomString} from "./RandomUtils";
import 'worker_threads';

declare const isMainThread: unknown;

export const isBrowser = typeof window !== 'undefined';

export const isWeChat = typeof wx !== 'undefined' && typeIsFalse(isBrowser);

export const isNode = typeIsFalse(isBrowser) && typeIsFalse(isWeChat) && typeof global !== 'undefined';

export enum EnvironmentType {
  BROWSER,
  BROWSER_WORKER,
  WECHAT_MINIPROGRAM,
  NODE,
  NODE_THREAD,
  UNKNOWN
}

export const environmentType: EnvironmentType = getEnvironmentType();

function getEnvironmentType(): EnvironmentType {
  const hasWindow = typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined',
        hasGlobal = typeof global !== 'undefined',
        hasWx = typeof wx !== 'undefined' && typeIsFunction(wx.createLivePusherContext),
        hasSelf = typeof self !== 'undefined',
        _isMainThread = typeof isMainThread === 'boolean' ? isMainThread : false;
  let _environmentType: EnvironmentType = EnvironmentType.UNKNOWN;

  if (hasWindow && !hasGlobal && !hasWx) _environmentType = EnvironmentType.BROWSER;
  else if (!hasWindow && !hasGlobal && !hasWx && hasSelf) _environmentType = EnvironmentType.BROWSER_WORKER;
  else if (!hasWindow && hasGlobal && !hasWx && _isMainThread) _environmentType = EnvironmentType.NODE;
  else if (!hasWindow && hasGlobal && !hasWx && !_isMainThread) _environmentType = EnvironmentType.NODE_THREAD;
  else if (!hasWindow && !hasGlobal && hasWx) _environmentType = EnvironmentType.WECHAT_MINIPROGRAM;

  console.log(_environmentType);
  return _environmentType;
}

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
