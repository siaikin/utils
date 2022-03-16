import {notUAN, TYPE, typeIsFalse, typeIsThrowMulti} from './TypeUtils';

export enum RExpression {
  NUMBER_AND_LETTER = '^[0-9A-Za-z]*$',
  ALL = '^.*$',
  IPv4 = '([0-9]{1,3}(\\.[0-9]{1,3}){3})',
  IPv4_LOCAL = '(192\\.168\\.|169\\.254\\.|10\\.|172\\.(1[6-9]|2\\d|3[01]))',
  IPv6 = '(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}',
}

const _expressionMap: {[key: string]: RegExp} = {};

/**
 * 字符串正则匹配
 * @param str 需要匹配的字符串
 * @param expression 模式串
 */
export function match(str: string, expression: RExpression | string): boolean {
  const authParam = typeIsThrowMulti([
    [str, TYPE.String],
    [expression, TYPE.String]
  ]);
  let result = false;

  if (typeIsFalse(authParam.accept)) {
    throw authParam.error;
  } else {
    if (!notUAN(_expressionMap[expression])) _expressionMap[expression] = new RegExp(expression);

    result = _expressionMap[expression].test(str);
  }

  return result;
}
