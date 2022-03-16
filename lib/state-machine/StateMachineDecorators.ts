import {typeIsFunction, typeIsString} from '../utils';
import {StateMachineTranslation} from './StateMachine';

/**
 * 配置stateMachine
 *
 * @param init
 */
export function StateMachineAutoConfig(init: string): ClassDecorator {
  return (constructor) => {
    constructor['STATE_MACHINE_INITIAL_STATE'] = init;

    return constructor;
  };
}

/**
 * 设置接口能够在什么状态下调用以及接口调用完成后转换为什么状态.
 * @param from 能够在什么状态下调用
 * @param to  接口调用完成后转换为什么状态
 *            不传的情况下, 装饰器对应的接口调用完成后状态不会变化
 * @param progress 如接口为异步返回, 该值表示接口执行过操中应当为什么状态
 */
export function stateMachineTranslation(from: Array<string>, to?: string, progress?: string) {
  return (target: unknown, propertyKey: string): void => {
    if (typeof target !== 'object' || !target) return;
    if (!typeIsFunction(target.constructor)) return;

    if (!target.constructor['STATE_MACHINE_TRANSLATIONS']) target.constructor['STATE_MACHINE_TRANSLATIONS'] = [];

    const translations: Array<StateMachineTranslation> = [];
    /**
     * 如存在 `progress` 参数, 表示该接口在执行前状态需要变换为 `progress`. 在执行完毕后状态再变换为 `to`.
     *
     * 实现逻辑: 状态机会先执行 `propertyKey` 变换, 接口调用完成后再执行 `${propertyKey}-__PROGRESS_COMPLETE__` 变换.
     */
    if (typeIsString(progress)) {
      translations.push(
        {name: propertyKey, from: from, to: progress},
        {name: `${propertyKey}-__PROGRESS_COMPLETE__`, from: [progress], to},
      );
    } else {
      translations.push(
        {name: propertyKey, from, to},
      );

    }

    target.constructor['STATE_MACHINE_TRANSLATIONS'].push(...translations);
  };
}
