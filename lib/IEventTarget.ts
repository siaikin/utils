/**
 * 事件名称只能用 `string` , `number` 两种类型之一
 */
export type EventTargetType = string;

/**
 * 对事件监听时的额外选项
 */
export interface EventListenerOptions {
  once: boolean;
}

/**
 * 事件监听的回调函数类型
 * @param event 事件对象
 * @param removeSelf 调用该函数可以将当前的事件监听函数移除
 */
export interface IEventListenerObject<T, D extends keyof T> {
  listenerOptions: EventListenerOptions;
  removeSelf: () => void;
  listener: EventListenerType<T, D>;
}

export interface EventListenerType<T, D extends keyof T> {
  (event: D extends 'error' ? IErrorEvent<T, D> : IEvent<T, D>, removeSelf: () => void): void;
}

export interface IEventTarget<T> {
  addEventListener<D extends keyof T>(type: D, func: EventListenerType<T, D>, options?: EventListenerOptions): () => void;
  addEventListeners<D extends keyof T>(types: Array<D>, func: EventListenerType<T, D>, options?: EventListenerOptions): () => void;
  removeEventListener<D extends keyof T>(type: D, func: EventListenerType<T, D>): boolean;
  dispatchEvent<D extends keyof T>(event: IEvent<T, D>): boolean;
  dispatchEventLite<D extends keyof T>(type: D, message?: EventTargetData<GetEventListenerParametersType<T, D>>, error?: string): boolean;
  hasListener<D extends keyof T>(type: D): boolean;
  clearListener(): void;
}

export interface IEvent<T, D extends keyof T> {
  type: D;

  message: EventTargetData<GetEventListenerParametersType<T, D>>;
}

export interface EventTargetData<D> {
  result?: boolean;
  data: D;
}

export interface IErrorEvent<T, D extends keyof T> extends IEvent<T, D> {
  error: string | number;
}

export type GetEventListenerParametersType<T, R extends keyof T> = T[R] extends (...args: infer P) => unknown ? P[0] : never;

export type GetEventListenerName<T extends string> = T extends `on${infer R}` ? R : T;


export interface IEventListenerType {
  nothing(): void;
}
