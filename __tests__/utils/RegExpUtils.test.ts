import {match, RExpression} from "../../lib";

describe('[class: RegExpUtils] usage case', function () {
  describe('test [function: match] usage case', function () {
    it('match number and letter', () => {
      expect.assertions(3);
      expect(match('1234567890azAZ', RExpression.NUMBER_AND_LETTER)).toBe(true);
      expect(match('1234567890azAZ{', RExpression.NUMBER_AND_LETTER)).toBe(false);
      expect(match('1234567890azAZ ', RExpression.NUMBER_AND_LETTER)).toBe(false);
    });

    it('match ipv4 address', () => {
      expect(
        match('192.168.1.1', RExpression.IPv4) &&
        match('http:192.168.1.1', RExpression.IPv4) &&
        match('http://192.168.1.1', RExpression.IPv4) &&
        match('http://192.168.1.1:8080', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4)
      ).toBe(true);
      expect(
        match('47.103.73.37', RExpression.IPv4) &&
        match('http:47.103.73.37', RExpression.IPv4) &&
        match('http://47.103.73.37', RExpression.IPv4) &&
        match('http://47.103.73.37:8080', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv4)
      ).toBe(true);
      expect(match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080', RExpression.IPv4)).toBe(false);
    });

    it('match ipv4, ipv6 address', () => {
      // local ip address
      expect(
        match('192.168.1.1', RExpression.IPv4_LOCAL) &&
        match('http:192.168.1.1', RExpression.IPv4_LOCAL) &&
        match('http://192.168.1.1', RExpression.IPv4_LOCAL) &&
        match('http://192.168.1.1:8080', RExpression.IPv4_LOCAL) &&
        match('http://192.168.1.1:8080/test', RExpression.IPv4_LOCAL) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4_LOCAL) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4_LOCAL)
      ).toBe(true);
      expect(
        match('192.168.1.1', RExpression.IPv4) &&
        match('http:192.168.1.1', RExpression.IPv4) &&
        match('http://192.168.1.1', RExpression.IPv4) &&
        match('http://192.168.1.1:8080', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4) &&
        match('http://192.168.1.1:8080/test?param=test', RExpression.IPv4)
      ).toBe(true);
      expect(
        match('47.103.73.37', RExpression.IPv4) &&
        match('http:47.103.73.37', RExpression.IPv4) &&
        match('http://47.103.73.37', RExpression.IPv4) &&
        match('http://47.103.73.37:8080', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv4) &&
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv4)
      ).toBe(true);
      expect(
        match('2001:3CA1:010F:001A:121B:0000:0000:0010', RExpression.IPv4) ||
        match('[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv4) ||
        match('http:[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/test', RExpression.IPv4) ||
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/test?param=test', RExpression.IPv4)
      ).toBe(false);
      // test ipv6 address
      /* todo 如何校验ipv6地址的各种格式? */
      expect(
        match('2001:3CA1:010F:001A:121B:0000:0000:0010', RExpression.IPv6) &&
        match('[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv6) &&
        match('http:[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv6) &&
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]', RExpression.IPv6) &&
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080', RExpression.IPv6) &&
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/test', RExpression.IPv6) &&
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/test?param=test', RExpression.IPv6) &&
        match('http://[2001:3CA1:010F:001A:121B:0000:0000:0010]:8080/test?param=test', RExpression.IPv6)
      ).toBe(true);
      expect(
        match('47.103.73.37', RExpression.IPv6) ||
        match('http:47.103.73.37', RExpression.IPv6) ||
        match('http://47.103.73.37', RExpression.IPv6) ||
        match('http://47.103.73.37:8080', RExpression.IPv6) ||
        match('http://47.103.73.37:8080/', RExpression.IPv6) ||
        match('http://47.103.73.37:8080/test', RExpression.IPv6) ||
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv6) ||
        match('http://47.103.73.37:8080/test?param=test', RExpression.IPv6)
      ).toBe(false);
    });

    it('input not string should throw error', () => {
      expect.assertions(2);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => match(1, RExpression.NUMBER_AND_LETTER)).toThrow('type of variable 1 is not ["[object String]"]');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => match('1234567890azAZ{', 1)).toThrow('type of variable 1 is not ["[object String]"]');

    });
  });
});
