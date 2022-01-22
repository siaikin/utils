/**
 * 定义{@link Repopter}日志等级
 * @property DEBUG - 输出所有日志信息
 * @property INFO - 输出 INFO，WARN 和 ERROR 级别的日志信息
 * @property WARN - 输出 WARN 和 ERROR 级别的日志信息
 * @property ERROR - 输出 ERROR 级别的日志信息
 * @property NONE - 不输出日志信息
 */
export enum LoggerLevel {
  DEBUG = 0,

  INFO = 1,

  WARN = 2,

  ERROR = 3,

  NONE = 4,
}
