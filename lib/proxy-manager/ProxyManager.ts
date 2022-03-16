import {Reportable} from '../reporter-manager';
import {IProxyManager} from './IProxyManager';
import {randomNumber, TYPE, typeIsFunction, typeOf} from '../utils';
import {clearMarkPoint, measureMarkPoint, setMarkPoint} from '../utils';

export class ProxyManager<T extends Reportable> extends Reportable implements IProxyManager<T> {
  private static _handleConcatParametersType(variable: unknown, index: number, variableType: string = typeOf(variable)): string {
    let result: string;

    switch (variableType) {
      case TYPE.String:
      case TYPE.BigInt:
      case TYPE.Boolean:
      case TYPE.Null:
      case TYPE.Undefined:
      case TYPE.Number:
        result = `${index}.%s `;
        break;
      case TYPE.Object:
      case TYPE.Array:
      case TYPE.RTCSessionDescription:
        result = `${index}.%j `
        break;
      case TYPE.Error:
        result = `${index}.%s `
        break;
      default:
        result = `${index}.${variableType} `;
    }

    return result;
  }

  private readonly proxiedSet: WeakSet<T | ({new (...args: Array<unknown>): T})>;

  constructor() {
    super();
    this.proxiedSet = new WeakSet<T>();
  }

  proxied(instance: T | ({new (...args: Array<unknown>): T})): boolean {
    return this.proxiedSet.has(instance);
  }

  proxy(instance: T): T {
    if (!(instance instanceof Reportable)) {
      throw new TypeError(`the instance type is ${typeOf(instance)}, not a [Reportable] instance`);
    }

    const proxied = new Proxy<T>(instance, {
      get: this._handleGet.bind(this)
    });
    this.proxiedSet.add(proxied)

    return proxied;
  }

  /**
   * 代理class, 返回一个代理后的对象
   * @param clazz
   */
  proxyClass<R extends {new (...args: Array<unknown>): T}>(clazz: R): R {
    if (!(clazz.prototype instanceof Reportable)) {
      const constructor = clazz.constructor || clazz.prototype.constructor;
      throw new TypeError(`the class ${(constructor.name)}, not inherit [Reportable]`);
    }

    const proxied = new Proxy(clazz, {
      construct: (target: R, argArray: ArrayLike<unknown>, newTarget: never): T => {
        const len = argArray.length,
              args: Array<unknown> = [];
        let result,
            inputParamsFormatStr = '[%s] ',
            returnValueFormatStr = '[%s] ';

        //  打印入参
        for (let i = 0; i < len; i++) {
          args.push(argArray[i]);
          inputParamsFormatStr += ProxyManager._handleConcatParametersType(argArray[i], i);
        }

        this.reporter.info(inputParamsFormatStr, target.name, ...args);

        try {
          if (typeIsFunction(target['beforeConstruct'])) {
            target['beforeConstruct']();
          }
          result = Reflect.construct(target, argArray, newTarget);

          returnValueFormatStr += 'inst created';
          this.reporter.info(returnValueFormatStr, target.name);
        } catch (e) {
          this.reporter.instanceToError(e);
          throw e;
        }


        return this.proxy(result);
      },
    });
    this.proxiedSet.add(proxied);

    return proxied;
  }

  /**
   * 代理属性获取和接口调用的操作
   * @param target
   * @param p
   * @private
   */
  protected _handleGet(target: T, p: PropertyKey): unknown {
    let result;

    //  函数调用
    if (typeIsFunction(target[p])) {
      result = this._handleGetFunction(target, p);
    } else {
      result = target[p];
    }

    return result;
  }

  protected _handleGetFunction(target: T, p: PropertyKey): (...args: Array<unknown>) => unknown {
    let result;
    const clazz = Reflect.getPrototypeOf(target)?.constructor as typeof Reportable;
    //  该函数名如果被忽略则不会打印日志
    if (clazz && clazz.IGNORE_FUNCTION_MEMBER.includes(p)) {
      result = (...args: Array<unknown>) => {
        return Reflect.apply(target[p], target, args);
      }
    } else {
      result = (...args: Array<unknown>) => {
        const len = args.length,
              markName = '_handleGetFunction',
              startPointId = randomNumber(Number.MAX_SAFE_INTEGER),
              endPointId = startPointId + 1;
        let beforeApplyFormatStr = '[%s] ',
            afterApplyFormatStr = '[%s] ';

        //  打印入参
        for (let i = 0; i < len; i++) {
          beforeApplyFormatStr += ProxyManager._handleConcatParametersType(args[i], i);
        }
        target.reporter.debug(beforeApplyFormatStr, p, ...args);

        setMarkPoint(markName, startPointId);
        let funcReturnValue = Reflect.apply(target[p], target, args);
        setMarkPoint(markName, endPointId);
        const returnValueType = typeOf(funcReturnValue),
              duration = measureMarkPoint(markName, startPointId, endPointId)[0];
        clearMarkPoint(markName, startPointId, endPointId);

        //  处理返回值
        switch (returnValueType) {
          case TYPE.Promise:
            funcReturnValue = funcReturnValue
              .then((data) => {
                afterApplyFormatStr += `ret(${duration}ms).${ProxyManager._handleConcatParametersType(data, 0)}`;
                target.reporter.debug(afterApplyFormatStr, p, data);
                return data;
              })
              .catch((reason) => {
                afterApplyFormatStr += `throw(${duration}ms).${ProxyManager._handleConcatParametersType(reason, 0)}`;
                target.reporter.error(afterApplyFormatStr, p, reason.toString());
                return Promise.reject(reason);
              });
            break;
          default:
            afterApplyFormatStr += `ret(${duration}ms).${ProxyManager._handleConcatParametersType(funcReturnValue, 0, returnValueType)}`;
            target.reporter.debug(afterApplyFormatStr, p, funcReturnValue);
        }

        return funcReturnValue;
      };
    }

    return result;
  }
}

export const ProxyManagerInstance = new ProxyManager();
