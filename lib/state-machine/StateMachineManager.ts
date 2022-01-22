import {ProxyManager} from "../proxy-manager";
import {Controllable} from "./Controllable";
import {TYPE, typeOf} from "../utils";

export class StateMachineManager<T extends Controllable> extends ProxyManager<T> {
  constructor() {
    super();
  }

  protected _handleGetFunction(target: T, p: PropertyKey): (...args: unknown[]) => unknown {
    const stateMachine = target.stateMachine,
          oldState = stateMachine.currentState,
          name = p as string;
    let result: (...args: unknown[]) => unknown;

    /**
     * 以下两种状态将允许接口调用:
     * 1. 状态机当前状态允许名为 `name` 的状态转换.
     * 2. 状态机中不存在名为 `name` 的状态.(避免未经过{@link stateMachineTranslation}标记的接口无法调用)
     */
    if (
      (stateMachine.has(name) && stateMachine.isAllow(name)) ||
      !stateMachine.has(name)
    ) {
      result = (...args: Array<unknown>) => {
        try {
          /**
           * 存在 `${name}-__PROGRESS_COMPLETE__` 认为定义过执行中状态, 在调用实际接口前会将状态转换为执行中状态.
           * @see {@link stateMachineTranslation}
           */
          const progressResultTranslationName = `${name}-__PROGRESS_COMPLETE__`,
                hasProgressState = stateMachine.has(progressResultTranslationName);

          if (hasProgressState) {
            stateMachine.translate(name);
          }

          let _result: any = super._handleGetFunction(target, p)(...args);
          const returnValueType = typeOf(_result);

          switch (returnValueType) {
            case TYPE.Promise:
              _result = _result
                .then((data) => {
                  stateMachine.translate(progressResultTranslationName);
                  return data;
                })
                .catch((reason) => {
                  //  出现异常回退状态
                  stateMachine.currentState = oldState;
                  return Promise.reject(reason);
                });
              break;
            default:
              stateMachine.translate(progressResultTranslationName);
          }

          return _result;
        } catch (e) {
          //  出现异常回退状态
          stateMachine.currentState = oldState;
          throw this.reporter.instanceToError(e);
        }
      };
    } else {
      result = () => {
        return Promise.reject(this.reporter.errorToInstance(`current state is ${target.stateMachine.currentState}, not allow use [${name}]`));
      };
    }

    return result;
  }
}

export const StateMachineManagerInstance = new StateMachineManager();
