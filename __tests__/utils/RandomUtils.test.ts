import {randomString} from '../../lib';

describe('[class: RandomUtils] usage case', function () {
  describe('test [function: randomString] usage case', function () {
    it('when the length <= 0 should return empty string', () => {
      expect.assertions(2);
      expect(randomString(0)).toBe('');
      expect(randomString(-1)).toBe('');
    })

    it('when the input length >= 65535 should return a string of length < 65535', () => {
      expect.assertions(2);
      expect(randomString(65535).length).toBeLessThan(65535);
      expect(randomString(Number.MAX_SAFE_INTEGER).length).toBeLessThan(65535);
    })
  });

});
