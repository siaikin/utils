import {notUAN, TYPE, typeIs, typeIsArray, typeIsFunction, typeIsString, typeIsTrue} from './utils';
import {
  EventListenerType,
  IEventTarget,
  EventListenerOptions,
  EventTargetData,
  IEvent, IErrorEvent, IEventListenerObject, GetEventListenerParametersType
} from './IEventTarget';

/**
 * EventTarget实现了基本的事件触发机制
 * 参考 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 实现的简单事件触发机制
 */
export class EventTarget<T = never> implements IEventTarget<T> {
  static DEFAULT_EVENT_LISTENER_OPTIONS: EventListenerOptions = {
    once: false
  };

  listenerMap: Record<keyof T, Array<IEventListenerObject<T, keyof T>>>;

  constructor() {
    this.listenerMap = {} as Record<keyof T, Array<IEventListenerObject<T, keyof T>>>;
  }

  /**
   * 添加事件监听器
   * @param type - 要监听的事件类型
   *
   * @param func - 事件监听回调
   * @param [options] - 设置监听器参数
   * @return 若添加成功则返回一个函数, 用于移除事件监听
   */
  // addEventListener(
  //   type: GetEventListenerName<keyof T, 'on'>,
  //   func: EventListenerType<T>,
  //   options: EventListenerOptions = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS
  // )
  //   : () => void
  addEventListener<D extends keyof T>(type: D, func: EventListenerType<T, D>, options?: EventListenerOptions): () => void
  {
    if (!typeIs(type, TYPE.String, TYPE.Number) || !typeIsFunction(func)) throw new Error();

    const removeSelf = () => this.removeEventListener(type, func);

    options = {
      ...EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS,
      ...options
    };
    //  绑定监听器函数的可选项到函数对象上
    const funcObj: IEventListenerObject<T, D> = {
      listenerOptions: options,
      removeSelf,
      listener: func,
    };

    if (!typeIsArray(this.listenerMap[type])) {
      this.listenerMap[type] = [];
    }
    this.listenerMap[type].push(funcObj);

    return removeSelf;
  }

  /**
   * 对多个事件添加同一个事件监听器
   * @param types - 要监听的事件类型
   * @param func - 事件监听回调
   * @param options - 设置监听器参数
   * @return 若添加成功则返回一个函数, 用于移除事件监听
   */
  // addEventListeners<R extends keyof T>(
  //   types: Array<GetEventListenerName<keyof T, 'on'>>,
  //   func: EventListenerType<T>,
  //   options: EventListenerOptions = EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS
  // )
  //   : () => void
  addEventListeners<D extends keyof T>(types: Array<D>, func: EventListenerType<T, D>, options?: EventListenerOptions): () => void
  {
    if (!typeIs(types, TYPE.Array) || !typeIs(func, TYPE.Function)) throw new Error();

    const removeFuncList: Array<() => void> = [];

    for (let i = types.length; i--;) {
      removeFuncList.push(this.addEventListener(types[i], func, options))
    }

    return () => removeFuncList.forEach(removeFunc => removeFunc());
  }

  /**
   * 移除事件监听器, 要提供与调用{@link addEventListener}或{@link addEventListeners}时相同的参数
   * @param type - 要移除的事件监听器类型
   * @param func - 要移除的事件监听器
   * @return 返回 `true` 表示移除成功
   */
  // removeEventListener<R extends keyof T>(
  //   type: GetEventListenerName<keyof T, 'on'>,
  //   func: EventListenerType<T>
  // )
  //   : boolean
  removeEventListener<D extends keyof T>(type: D, func: EventListenerType<T, D>): boolean
  {
    if (!typeIs(type, TYPE.String, TYPE.Number) ||
        !typeIs(func, TYPE.Function) ||
        !typeIs(this.listenerMap[type], TYPE.Array)) {
      return false;
    }

    const arr: Array<IEventListenerObject<T, D>> = this.listenerMap[type];
    const index = arr.findIndex((funcObj) => funcObj.listener === func);

    if (index <= -1) return false;
    else arr.splice(index, 1);

    return true;
  }

  /**
   * 分发事件
   * @param event - 分发的事件对象
   * @return 事件是否发送成功
   */
  // dispatchEvent<R extends keyof T>(event: Event<T>): boolean {
  dispatchEvent<D extends keyof T>(event: IEvent<T, D>): boolean {
  if (!notUAN(this.listenerMap[event.type])) this.listenerMap[event.type] = [];
    const arr: Array<IEventListenerObject<T, D>> = this.listenerMap[event.type];

    /**
     * `tempArr` 复制了 `listener` 数组, 避免在某次循环的回调函数中移除了事件监听器导致下标异常.
     * 使用tempArr遍历, 即使在循环中移除了监听器改变的是 `arr` 的下标, `tempArr` 不受影响.
     */
    const tempArr = arr.slice();
    tempArr.forEach(funcObj => funcObj.listener(event as D extends 'error' ? IErrorEvent<T, D> : IEvent<T, D>, funcObj.removeSelf));

    if (typeIsString(event.type)) {
      const eventType = event.type;
      const eventListenerLiteral = 'on' + eventType.substring(0, 1).toUpperCase() + eventType.substring(1);

      if (typeIsFunction(this[eventListenerLiteral])) this[eventListenerLiteral](event);
    }

    this.listenerMap[event.type] = arr
      .filter(func => !typeIsTrue(func.listenerOptions && func.listenerOptions.once));
    return true;
  }

  /**
   * 简化的{@link dispatchEvent}接口
   * @param type
   * @param message
   * @param error 具体错误类型, 此时 {@link dispatchEventLite}的 `type` 应是一个 `xxxEventType.Error` 类型
   */
  // dispatchEventLite<R extends keyof T>(
  //   type: GetEventListenerName<keyof T, 'on'>,
  //   message: EventTargetData<GetEventListenerParametersType<T>> = {data: {} as never},
  //   error?: string | number
  // )
  //   : boolean
  dispatchEventLite<D extends keyof T>(type: D, message: EventTargetData<GetEventListenerParametersType<T, D>> = {data: {} as never}, error?: string): boolean
  {
    let event;
    if (notUAN(error)) event = new ErrorEvent(type, error, message);
    else event = new Event(type, message);

    return this.dispatchEvent(event);
  }

  /**
   * 等待直到监听的事件被分发
   * @param type - 等待的事件类型
   *
   * @return 返回一个 {@link Promise} 对象, 当指定事件被触发时, {@link Promise} 将被 `resolve`. 当 监听 `error` 类型的事件时, {@link Promise} 会被 `reject`, 而不是 `resolve`.
   */
  async waitEvent<D extends keyof T>(type: D): Promise<GetEventListenerParametersType<T, D>>
  {
    if (!typeIs(type, TYPE.String, TYPE.Number)) throw new Error();

    return new Promise<GetEventListenerParametersType<T, D>>((resolve, reject) => {
      const func: EventListenerType<T, D> = (event, removeSelf) => {
        if (event.type === 'error') {
          reject((event as IErrorEvent<T, D>).error);
        } else {
          resolve((event as IEvent<T, D>).message.data);
        }

        removeSelf();
      };

      //  绑定监听器函数的可选项到函数对象上
      const funcObj: IEventListenerObject<T, D> = {
        listenerOptions: {
          ...EventTarget.DEFAULT_EVENT_LISTENER_OPTIONS,
          once: true,
        },
        removeSelf: () => this.removeEventListener(type, func),
        listener: func,
      };

      if (!typeIsArray(this.listenerMap[type])) {
        this.listenerMap[type] = [];
      }
      this.listenerMap[type].push(funcObj);
    })
  }

  /**
   * 指定类型的事件是否被监听
   * @param type
   */
  hasListener<D extends keyof T>(type: D): boolean {
    const arr: Array<IEventListenerObject<T, D>> = this.listenerMap[type];

    return  notUAN(arr) &&
            typeIs(arr, TYPE.Array) &&
            arr.length > 0;
  }

  /**
   * 清空所有绑定的事件
   */
  clearListener(): void {
    const keys = Object.keys(this.listenerMap);
    for (let i = keys.length; i--;) {
      delete this.listenerMap[keys[i]];
    }
  }
}

export class Event<T, D extends keyof T> implements IEvent<T, D> {
  type: D;

  message: EventTargetData<GetEventListenerParametersType<T, D>>;

  /**
   * @param type - 事件类型
   * @param message - 该事件携带的数据
   */
  constructor(type: D, message: EventTargetData<GetEventListenerParametersType<T, D>>) {
    this.type = type;

    if (!notUAN(message.result)) message.result = true;
    this.message = message;
  }
}

export class ErrorEvent<T, D extends keyof T> extends Event<T, D> implements IErrorEvent<T, D> {
  error: string | number;

  /**
   * @param type - 事件类型
   * @param error - 具体错误
   * @param message - 该事件携带的数据
   */
  constructor(type: D, error: string | number, message: EventTargetData<GetEventListenerParametersType<T, D>>) {
    super(type, message);
    this.error = error;
  }
}
