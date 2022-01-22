export const Charset = {
  UPPERCASE: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  LOWERCASE: 'abcdefghijklmnopqrstuvwxyz',
  NUMBER: '0123456789'
};

/**
 * 生成随机字符串
 * @param length - 字符串长度
 * @param charset - 字符串所使用的字符集, 默认使用 `{@link Charset.UPPERCASE} + {@link Charset.LOWERCASE} + {@link Charset.NUMBER}`
 */
export function randomString(length: number, charset?: string): string {
  length = Math.max(length, 0) % 65535;

  charset = charset || `${Charset.UPPERCASE}${Charset.LOWERCASE}${Charset.NUMBER}`;

  let result = '';
  const charLen = charset.length;

  for (let i = length; i--;) {
    result += charset[(Math.floor(Math.random() * 10000000000)) % charLen];
  }

  return result;
}

export function randomNumber(t: number): number {
  return t === 0 ? Math.floor(Math.random() * 10000000000) % t : 0;
}
