import {ProxyManagerInstance, Reportable} from '../../lib';

describe('[class: ProxyManager] usage case', function () {
  describe('test [function: proxy] usage case', function () {
    it('input instance of class Object should throw error', () => {
      expect.hasAssertions();

      const instance = {};

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => ProxyManagerInstance.proxy(instance))
        .toThrow(/the instance type is \[[^[\]]*], not a \[Reportable] instance$/);
    })

    it('input instance of class [Reportable] should return a [Proxy] instance', () => {
      expect.hasAssertions();

      const instance = ProxyManagerInstance.proxy(new Reportable());

      expect(instance instanceof Reportable).toBe(ProxyManagerInstance.proxied(instance));
    })

    it('proxied object works same way with origin object', async () => {
      expect.hasAssertions();

      // expect.assertions(4);
      class ProxiedObject extends Reportable {
        memberOne = 'memberOne';
        functionOne(): string {
          return 'this function one';
        }
        functionTwo(): Promise<void> {
          return Promise.resolve();
        }
        functionThree(): Promise<void> {
          return Promise.reject('normal error');
        }
      }

      const instance = new (ProxyManagerInstance.proxyClass(ProxiedObject))();

      expect(instance.memberOne).toBe('memberOne');
      expect(instance.functionOne()).toBe('this function one');

      await Promise.all([expect(instance.functionThree()).rejects.toMatch('normal error'), expect(instance.functionTwo()).resolves.toBeUndefined()]);
    })
  });

  describe('test [function: proxyClass] usage case', function () {
    it('input class not inherit [Reportable] should throw error', () => {
      expect.hasAssertions();

      const instance = class A {};

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(() => ProxyManagerInstance.proxyClass(instance))
        .toThrow(/the class [a-zA-Z]*, not inherit \[Reportable]/);
    })

    it('input class inherit [Reportable] should return  a [Proxy] instance', () => {
      expect.hasAssertions();

      const instance = ProxyManagerInstance.proxyClass(class A extends Reportable {});

      expect(instance.prototype instanceof Reportable).toBe(ProxyManagerInstance.proxied(instance));
    })
  });
});
