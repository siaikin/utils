import {deepMerge, throttle} from "../../lib";

describe('[class: FunctionUtils] usage case', function () {
  describe('test [function: throttle] usage case', function () {
    it('when the length <= 0 should return empty string', (cb) => {
      jest.setTimeout(2500);
      const
        func = jest.fn(),
        wrapFunc = throttle(func);

      wrapFunc();
      setInterval(() => {
        wrapFunc();
      }, 200);

      setTimeout(() => {
        expect(func).toHaveBeenCalledTimes(3);
        cb();
      }, 2500);
    })
  });

  describe('test [function: deepMerge] usage case', function () {
    it('', () => {
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
