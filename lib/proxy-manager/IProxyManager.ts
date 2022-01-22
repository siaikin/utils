import {Reportable} from "../reporter-manager";

export interface IProxyManager<T extends Reportable> {
  proxy(instance: T): void;
  proxyClass<R extends {new (...args: Array<unknown>): T}>(clazz: R): R;
  proxied(instance: T): boolean;
}
