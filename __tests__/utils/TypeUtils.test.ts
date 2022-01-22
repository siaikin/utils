import {
  notUAN, TYPE, typeIsArray, typeIsDate,
  typeIsFalse,
  typeIsFunction,
  typeIsNumber,
  typeIsString, typeIsThrow, typeIsThrowMulti,
  typeIsTrue
} from "../../lib";

describe('[class: TypeUtils] usage case', function () {
  describe('test [function: typeIsString] usage case', function () {
    it('input empty string should return false', () => {
      expect(typeIsString('')).toBe(false);
    })

    it('input empty string and allow null should return true', () => {
      expect(typeIsString('', false)).toBe(true);
    })
  });

  describe('test [function: typeIsNumber] usage case', function () {
    it('input NaN should return false', () => {
      expect(typeIsNumber(NaN)).toBe(false);
    })

    it('input NaN and allow NaN should return true', () => {
      expect(typeIsNumber(NaN, false)).toBe(true);
    })
  });

  describe('test [function: notUAN] usage case', function () {
    it('input [undefined] should return false', () => {
      expect(notUAN(undefined)).toBe(false);
    })

    it('input [null] should return false', () => {
      expect(notUAN(null)).toBe(false);
    })
  });

  describe('test [function: typeIsFunction] usage case', function () {
    it('input a arrow function should return true', () => {
      expect(typeIsFunction(() => undefined)).toBe(true);
    })

    it('input a function should return true', () => {
      expect(typeIsFunction(function _() { return undefined })).toBe(true);
    })
  });

  describe('test [function: typeIsFalse] usage case', function () {
    /**
     * what is [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy)
     */
    it('input a falsy value (expect [false]) should return false', () => {
      expect(typeIsFalse(0)).toBe(false);
      expect(typeIsFalse(-0)).toBe(false);
      // expect(typeIsFalse(0n)).toBe(false);
      expect(typeIsFalse('')).toBe(false);
      expect(typeIsFalse("")).toBe(false);
      expect(typeIsFalse(``)).toBe(false);
      expect(typeIsFalse(null)).toBe(false);
      expect(typeIsFalse(undefined)).toBe(false);
      expect(typeIsFalse(NaN)).toBe(false);
      // expect(typeIsFalse(document.all)).toBe(false);
    })

    it('input [false] should return true', () => {
      expect(typeIsFalse(false)).toBe(true);
    })
  });

  describe('test [function: typeIsTrue] usage case', function () {
    /**
     * what is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
     */
    it('input a falsy value (expect [true]) should return false', () => {
      expect(typeIsTrue({})).toBe(false);
      expect(typeIsTrue([])).toBe(false);
      expect(typeIsTrue(1)).toBe(false);
      expect(typeIsTrue(-1)).toBe(false);
      expect(typeIsTrue('0')).toBe(false);
    })

    it('input [true] should return true', () => {
      expect(typeIsTrue(true)).toBe(true);
    })
  });

  // describe('test [function: typeIsMediaStream] usage case', function () {
  //   it('input MediaStream instance should return true', async () => {
  //     expect(typeIsMediaStream(new MediaStream())).toBe(true);
  //   })
  // });

  // describe('test [function: typeIsMediaStreamTrack] usage case', function () {
  //   it('input typeIsMediaStreamTrack instance should return true', async () => {
  //   })
  // });

  describe('test [function: typeIsObject] usage case', function () {
    /**
     * what is [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy)
     */
    it('input a falsy value (expect [true]) should return false', () => {
      expect(typeIsTrue({})).toBe(false);
      expect(typeIsTrue([])).toBe(false);
      expect(typeIsTrue(1)).toBe(false);
      expect(typeIsTrue(-1)).toBe(false);
      expect(typeIsTrue('0')).toBe(false);
    })

    it('input [true] should return true', () => {
      expect(typeIsTrue(true)).toBe(true);
    })
  });

  describe('test [function: typeIsArray] usage case', function () {
    it('input Array should return true', () => {
      expect(typeIsArray([])).toBe(true);
    })
  });

  describe('test [function: typeIsDate] usage case', function () {
    it('input a invalid [Date] object should return true', () => {
      expect(typeIsDate(new Date(''))).toBe(true);
    })

    it('input a invalid [Date] object and enable valid should return false', () => {
      expect(typeIsDate(new Date(''), true)).toBe(false);
    })
  });

  describe('test [function: typeIsThrow] usage case', function () {
    it('input a false type value should throw error', () => {
      expect(() => typeIsThrow('a string value', TYPE.Number)).toThrow();
    })

    it('input a right type value should return true', () => {
      expect(typeIsThrow('a string value', TYPE.String)).toBe(true);
    })
  });

  describe('test [function: typeIsThrowMulti] usage case', function () {
    it('input value not a [Array] should throw error', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => typeIsThrowMulti('')).toThrow();
    })

    it('if multiple false value input, error throw only the last false value', () => {
      expect(() => {
        throw typeIsThrowMulti([
          ['first error', TYPE.Number],
          ['second error', TYPE.Boolean],
        ])
          .error;
      }).toThrow('second error');
    })
  });
});
