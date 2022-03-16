import {format} from 'format';
import {notUAN, typeIsNumber, typeIsString} from '../utils';
import {LoggerLevel} from './LoggerLevel';

export class Reporter {
  _level: LoggerLevel;
  get level(): LoggerLevel {
    return this._level;
  }
  set level(level: LoggerLevel) {
    this._level = level;
  }

  _className: string;
  get className(): string {
    return this._className;
  }

  _instanceName: string;
  get instanceName(): string {
    return this._instanceName;
  }

  /**
   * 构造函数
   * @param className 类名
   * @param instanceName 实例名
   * @param level 日志等级
   */
  constructor(className: string, instanceName?: string, level?: LoggerLevel) {
    this._className = notUAN(className) ? className : '';
    this._instanceName = typeIsString(instanceName) ? instanceName : '';
    this._level = typeIsNumber(level) ? level : LoggerLevel.DEBUG;
  }

  /**
   * 记录{@link LoggerLevel.DEBUG}级别的日志
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  debug(format: string, ...args: Array<unknown>): void {
    this.log(LoggerLevel.DEBUG, format, ...args);
  }

  /**
   * 记录{@link LoggerLevel.INFO}级别的日志
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  info(format: string, ...args: Array<unknown>): void {
    this.log(LoggerLevel.INFO, format, ...args);
  }

  /**
   * 记录{@link LoggerLevel.WARN}级别的日志
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  warning(format: string, ...args: Array<unknown>): void {
    this.log(LoggerLevel.WARN, format, ...args);
  }

  /**
   * 记录{@link LoggerLevel.ERROR}级别的日志
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  error(format: string, ...args: Array<unknown>): void {
    this.log(LoggerLevel.ERROR, format, ...args);
  }

  /**
   * 功能同{@link error}, 但{@link errorToObject}将返回一个{@link Error}对象
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  errorToObject(format: string, ...args: Array<unknown>): Error {
    const text = this.log(LoggerLevel.ERROR, format, ...args);

    return new Error(text);
  }

  /**
   * 功能同{@link error}, 但{@link errorToObject}将返回一个{@link Error}对象
   * @param format - 格式化字符串
   * @param args - 格式化参数
   */
  errorToInstance(format: string, ...args: Array<unknown>): Error {
    const text = this.log(LoggerLevel.ERROR, format, ...args);

    return new Error(text);
  }

  /**
   * 功能同{@link error}, 但{@link objectToError}可传入一个{@link Error}对象
   * @param error
   */
  objectToError(error: Error): Error {
    this.log(LoggerLevel.ERROR, '%s %s %s', error.name, error.message, error.stack);
    return error;
  }

  /**
   * 功能同{@link error}, 但{@link objectToError}可传入一个{@link Error}对象
   * @param error
   */
  instanceToError<T>(error: T): T {
    if (typeIsString(error)) {
      this.log(LoggerLevel.ERROR, error);
    } else if (error instanceof Error) {
      this.log(LoggerLevel.ERROR, '%s %s %s', error.name, error.message, error.stack);
    } else {
      this.log(LoggerLevel.ERROR, '%j', error);
    }

    return error;
  }

  /**
   * 记录指定级别的日志
   * @param level - 日志级别
   * @param formatStr - 格式化字符串
   * @param args - 格式化参数
   */
  log(level: LoggerLevel, formatStr: string, ...args : Array<unknown>): string {
    const log = format(...[`${formatStr}`, ...args]);
    this.onlog(log, level, this.className, this.instanceName, formatStr, ...args);

    return log;
  }

  /**
   * 记录日志的事件, 每一条日志记录都会触发一次该事件,
   * @param logStr - 该条日志的格式化后的字符串, 可直接打印到控制台
   * @param level - 日志等级
   * @param className - 该日志对应的类名
   * @param instanceName - 该日志对应的实例名
   * @param formatStr - 格式化字符串
   * @param args - 格式化参数
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onlog(logStr: string, level: LoggerLevel, className: string, instanceName: string, formatStr: string, ...args: Array<unknown>): void {
    // const str = [
    //   `${timeString()}\t%c[${LoggerLevel[level]}]`,
    //   `color: ${Reporter.LOGGER_LEVEL_COLOR[level]}`,
    //   `\t${className}\t${instanceName}\t${logStr}`
    // ]
    // switch (level) {
    //   case LoggerLevel.DEBUG:
    //     console.log(...str);
    //     break;
    //   case LoggerLevel.INFO:
    //     console.log(...str);
    //     break;
    //   case LoggerLevel.WARN:
    //     console.warn(...str);
    //     break;
    //   case LoggerLevel.ERROR:
    //     console.error(...str);
    //     break;
    // }
  }
}
