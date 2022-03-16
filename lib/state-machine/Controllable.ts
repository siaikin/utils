import {Reportable} from '../reporter-manager';
import {StateMachine, StateMachineTranslation} from './StateMachine';
import {notUAN, typeIsArray, typeIsString, typeIsTrue} from '../utils';

export class Controllable<T = never> extends Reportable<T> {
  /**
   * 状态变化配置, 保存状态转换对应关系
   */
  static STATE_MACHINE_TRANSLATIONS: Array<StateMachineTranslation> = [];
  /**
   * 设置状态机的初始状态
   */
  static STATE_MACHINE_INITIAL_STATE = 'init';

  static CONTROLLABLE_DEFAULT_CONFIG: ControllableConfig = {
    enableMethodIntercept: true
  };

  constructor(config: Partial<ControllableConfig> = {}) {
    super();

    config = {
      ...Controllable.CONTROLLABLE_DEFAULT_CONFIG,
      ...config
    };

    let initialState: string | undefined,
        translations: Array<StateMachineTranslation> | undefined,
        constructor: typeof Controllable = (this.constructor as typeof Controllable);

    while (notUAN(constructor)) {
      if (!typeIsString(initialState) && typeIsString(constructor.STATE_MACHINE_INITIAL_STATE)) {
        initialState = constructor.STATE_MACHINE_INITIAL_STATE;
      }
      if (!typeIsArray(translations) && typeIsArray(constructor.STATE_MACHINE_TRANSLATIONS)) {
        translations = constructor.STATE_MACHINE_TRANSLATIONS;
      }

      constructor = Object.getPrototypeOf(constructor);
    }

    this.stateMachine = new StateMachine({
      init: initialState || Controllable.STATE_MACHINE_INITIAL_STATE,
      /**
       * 如{@link ControllableConfig.enableMethodIntercept}为 `false`, 传入状态机的状态变化数据为空数组,
       * 此时{@link StateMachineManager}将不会拦截任何接口调用.
       */
      translations: typeIsTrue(config.enableMethodIntercept)
                      ? translations || Controllable.STATE_MACHINE_TRANSLATIONS
                      : [],
    });
  }

  stateMachine: StateMachine;
}

export interface ControllableConfig {
  /**
   * 是否拦截方法调用, 默认为 `true`.
   *
   * 关闭后{@link StateMachineManager}将不会再拦截任何非法的接口调用.
   */
  enableMethodIntercept: boolean;
}
