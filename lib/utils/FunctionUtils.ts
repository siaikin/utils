import {notUAN, TYPE, typeIsFunction, typeIsNumber, typeIsObject, typeOf} from './TypeUtils';

/**
 * @param target
 */
export function clone<T>(target: T): T {
  const targetType = typeOf(target);
  let result, varKeys;

  switch (targetType) {
    case TYPE.Object:
      result = {};
      varKeys = Object.keys(target);
      for (let i = 0; i < varKeys.length; i++) {
        result[varKeys[i]] = clone(target[varKeys[i]]);
      }

      break;
    case TYPE.Array:
      result = [];
      for (let i = 0; i < (target as unknown as Array<unknown>).length; i++) {
        result.push(clone(target[i]));
      }
      break;
    case TYPE.String:
    case TYPE.Number:
    case TYPE.Boolean:
    case TYPE.Null:
    case TYPE.Undefined:
    default:
      result = target;
      break;
  }

  return result;
}

/**
 * deep merge
 * @param target
 * @param source
 */
export function deepMerge<T>(target: T, source: T): T {
  if (!typeIsObject(target) || !typeIsObject(source)) return target;

  const keys = Object.keys(source);

  for (let i = keys.length; i--;) {
    const key = keys[i],
          targetV = target[key],
          sourceV = source[key];

    if (typeIsObject(sourceV) && typeIsObject(targetV)) deepMerge(targetV, sourceV)
    else (target as Record<string | number, unknown>)[key] = sourceV;
  }

  return target;
}

export interface DebouncedFunction<FUNC extends (...args: Array<any>) => any> {
  (...args: Parameters<FUNC>): void;
  cancel(): void;
}
export function debounce<FUNC extends (...args: Array<any>) => any>(func: FUNC, delay = 1000): DebouncedFunction<FUNC> {
  function exec(...args: Array<unknown>) {
    func.apply(this, args);
  }

  let timeoutKey: ReturnType<typeof setTimeout> | undefined,
      canceled = false;

  const deFunc: DebouncedFunction<FUNC> = function (...args: Parameters<FUNC>): void {
    if (canceled) return;


    const _arguments = args;

    if (notUAN(timeoutKey) && timeoutKey) {
      clearTimeout(timeoutKey);
    }

    timeoutKey = setTimeout(function () {
      exec.apply(this, _arguments);
      timeoutKey = undefined;
    }, delay);
  };

  deFunc.cancel = function () {
    if (notUAN(timeoutKey)) {
      clearTimeout(timeoutKey);
      canceled = true;
    }
  }

  return deFunc;
}

export function throttle<FUNC extends (...args: Array<any>) => any>(func: FUNC, interval = 1000): (...args: Parameters<FUNC>) => void {
  function exec(...args: Array<unknown>) {
    func.apply(this, args);
  }

  let last = 0;

  return function (...args: Parameters<FUNC>): void {
    const ts = Date.now();

    if (ts >= last + interval) {
      exec.apply(this, args);
      last = ts;
    }
  }
}

/**
 * [指数退避算法](https://cloud.google.com/memorystore/docs/redis/exponential-backoff?hl=zh-cn)
 * @param func 重试函数
 * @param maxTimes 最大重试次数
 * @param maximumBackoff 最大退避时间
 * @return 返回一个函数用于中断重试
 */
export function backoff(func: (abort: () => void, retryTimes: number, timeout: number) => unknown, maxTimes = 8, maximumBackoff = 32): () => void {
  if (!typeIsFunction(func) || !typeIsNumber(maxTimes) || !typeIsNumber(maximumBackoff)) throw new Error();

  let timeout = -1,
    retryTimes = 0,
    retryIntervalKey: ReturnType<typeof setTimeout>;

  function exec() {
    if (retryTimes >= maxTimes) return;

    timeout = Math.min(2 ** retryTimes, maximumBackoff) * 1e3 + Math.floor(Math.random() * 1e3);
    retryTimes++;

    retryIntervalKey = setTimeout(() => {
      func(abort, retryTimes, timeout);
      exec();
    }, timeout);
  }

  function abort() {
    clearTimeout(retryIntervalKey);
  }

  exec();

  return abort;
}
