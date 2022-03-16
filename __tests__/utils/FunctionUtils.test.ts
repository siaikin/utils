import {deepMerge, throttle} from '../../lib';

describe('[class: FunctionUtils] usage case', function () {
  describe('test [function: throttle] usage case', function () {
    it('when the length <= 0 should return empty string', async () => {
      expect.hasAssertions();

      jest.setTimeout(2500);
      const
        func = jest.fn(),
        wrapFunc = throttle(func);

      wrapFunc();
      setInterval(() => {
        wrapFunc();
      }, 200);

      await new Promise((resolve) => setTimeout(resolve, 2500));
      expect(func).toHaveBeenCalledTimes(3);
    })
  });

  describe('test [function: deepMerge] usage case', function () {
    it('a', () => {
      expect.hasAssertions();

      const A = {
          firstLayer: {secondLayer: 1}
        },
        B = {
          firstLayer: {secondLayer: 2}
        };

      expect(deepMerge(A, B).firstLayer.secondLayer).toBe(2);
    })
  });

});
