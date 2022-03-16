const CUSTOM_TYPE = /\[object [a-zA-Z]*]/;

/**
1 * 类型定义
 */
export enum TYPE {
  Array = '[object Array]',
  Boolean = '[object Boolean]',
  BigInt = '[object BigInt]',
  Date = '[object Date]',
  Error = '[object Error]',
  Function = '[object Function]',
  AsyncFunction = '[object AsyncFunction]',
  Number = '[object Number]',
  Null = '[object Null]',
  Math = '[object Math]',
  MediaStream = '[object MediaStream]',
  LocalMediaStream = '[object LocalMediaStream]',
  MediaStreamTrack = '[object MediaStreamTrack]',
  AudioStreamTrack = '[object AudioStreamTrack]',
  VideoStreamTrack = '[object VideoStreamTrack]',
  CanvasCaptureMediaStreamTrack = '[object CanvasCaptureMediaStreamTrack]',
  Object = '[object Object]',
  RegExp = '[object RegExp]',
  String = '[object String]',
  Symbol = '[object Symbol]',
  Undefined = '[object Undefined]',
  Unknown = '[object Unknown]',
  Promise = '[object Promise]',
  RTCSessionDescription = '[object RTCSessionDescription]',
}

/**
 * 组合类型定义
 */
export const TYPE_COMPOSE: { [key: string]: Array<TYPE> } = {
  UAN: [TYPE.Undefined, TYPE.Null]
};

export type Primitives = string | number | bigint | undefined | symbol | null;

/**
 * 返回变量的类型
 * @param variable
 */
export function typeOf(variable: unknown): TYPE | string {
  let type: TYPE | string;
  if (typeof variable === 'undefined' || variable === undefined) type = TYPE.Undefined;
  else if (variable === null) type = TYPE.Null;
  else type = Object.prototype.toString.call(variable) as TYPE;

  if (type === TYPE.Object && typeIsFunction((variable as { toString(): string }).toString)) {
    const customType = (variable as { toString(): string }).toString();

    if (CUSTOM_TYPE.test(customType)) type = customType;
  }

  return type;
}

/**
 * 判断变量是否为`typeArray`中的某一个类型
 * @param variable - 待判断的变量
 * @param typeArray - 预选类型
 * @return {boolean} - `variable`的类型存在与`typeArray`中返回`true`，不存在返回`false`
 */
export function typeIs(variable: unknown, ...typeArray: Array<TYPE>): boolean {
  const varType: TYPE | string = typeOf(variable);
  for (let i: number = typeArray.length; i--;) {
    if (varType === typeArray[i]) return true;
  }
  return false;
}

/**
 * 判断变量类型是否为{@link string}
 * @param variable
 * @param [notNull=true] 是否不允许空字符串, 即 `''`
 */
export function typeIsString(variable: unknown, notNull = true): variable is string {
  return typeIs(variable, TYPE.String) && (notNull ? (variable as string).length > 0 : true);
}

/**
 * 判断变量类型是否为{@link number}
 * @param variable
 * @param [notNaN=true] - 是否不允许变量为{@link NaN}
 */
export function typeIsNumber(variable: unknown, notNaN = true): variable is number {
  return typeIs(variable, TYPE.Number) && (notNaN ? !Number.isNaN(variable) : true);
}

/**
 * 判断变量是否非空, 即变量不为 `undefined` 和 `null`
 * @param variable
 */
export function notUAN<T>(variable: T): variable is NonNullable<T> {
  return !typeIs(variable, ...TYPE_COMPOSE.UAN);
}

/**
 * 判断变量类型是否为{@link function}
 *
 * **注: [AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction) 也被认为是一个 {@link function}**
 *
 * @param variable
 */
export function typeIsFunction(variable: unknown): variable is (...args: Array<unknown>) => unknown {
  return typeIs(variable, TYPE.Function, TYPE.AsyncFunction);
}

/**
 * 判断变量类型是否为 `true`
 * @param variable
 */
export function typeIsTrue(variable: unknown): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && variable as boolean;
}

export function typeIsFalse(variable: unknown): variable is boolean {
  return typeIs(variable, TYPE.Boolean) && !(variable as boolean);
}

export function typeIsMediaStream(variable: unknown): variable is MediaStream {
  return typeIs(variable, TYPE.MediaStream, TYPE.LocalMediaStream);
}

export function typeIsMediaStreamTrack(variable: unknown): variable is MediaStreamTrack {
  return typeIs(
    variable,
    TYPE.MediaStreamTrack,
    TYPE.AudioStreamTrack,
    TYPE.VideoStreamTrack,
    TYPE.CanvasCaptureMediaStreamTrack
  );
}

export function typeIsObject(variable: unknown): variable is Record<string | number, unknown> {
  return typeIs(variable, TYPE.Object);
}

export function typeIsArray(variable: unknown): variable is Array<unknown> {
  return typeIs(variable, TYPE.Array);
}

export function typeIsPromise(variable: unknown): variable is Promise<unknown> {
  return typeIs(variable, TYPE.Promise);
}

export function typeIsDate(variable: unknown, isValid = false): variable is Date {
  return typeIs(variable, TYPE.Date) && (isValid ? !Number.isNaN((variable as Date).getTime()) : true);
}

/**
 * 判断变量类型是否为布尔类型
 * @param variable
 */
export function typeIsBoolean(variable: unknown): variable is boolean {
  return typeIs(variable, TYPE.Boolean);
}

export function typeIsThrow(variable: unknown, ...typeArray: Array<TYPE>): boolean {
  if (typeIs(variable, ...typeArray)) {
    return true;
  } else {
    throw new Error(`type of variable ${JSON.stringify(variable)} is not ${JSON.stringify(typeArray)}`);
  }
}

export function typeIsThrowMulti(variableParameterArr: Array<[unknown, ...Array<TYPE>]>): {accept: boolean, error: Error} {
  if (!typeIsArray(variableParameterArr)) throw new Error('variableParameterArr is not a array');
  const _result = {
    accept: true,
    error: {} as Error
  };

  for (let i = variableParameterArr.length, variableParameter: [unknown, ...Array<TYPE>]; i--, variableParameter = variableParameterArr[i];) {
    try {
      typeIsThrow(...variableParameter);
    } catch (e) {
      _result.accept = false;
      _result.error = e;
      break;
    }
  }

  return _result;
}

export function typeIsPrimitives(variable: unknown): variable is Primitives {
  switch (typeOf(variable)) {
    case TYPE.String:
    case TYPE.BigInt:
    case TYPE.Boolean:
    case TYPE.Null:
    case TYPE.Undefined:
    case TYPE.Number:
      return true;
    default:
      return false;
  }
}

// function isPrimitives(variable: unknown): variable is Primitives {
//   switch (typeof variable) {
//     case "object":
//     case "function":
//       return false;
//     default:
//       return true;
//   }
// }
