import {isBrowser, timeString, typeIsNumber, typeIsTrue} from "../utils";
import {EventTarget} from "../EventTarget";
import {Reporter} from "../reporter";
import {LoggerLevel} from "../reporter";
import {IReporterManager, LogInfo} from "./IReporterManager";
import {ReporterManagerEventType} from "./ReporterManagerEventType";

export class ReporterManager extends EventTarget implements IReporterManager {
  static LOGGER_LEVEL_COLOR: Record<LoggerLevel, string> = {
    [LoggerLevel.DEBUG]: '#69B8F6',
    [LoggerLevel.INFO]: '#1E88E5',
    [LoggerLevel.WARN]: '#FB8C00',
    [LoggerLevel.ERROR]: '#B00020',
    [LoggerLevel.NONE]: '',
  };

  constructor() {
    super();

    this._level = LoggerLevel.DEBUG;
    this._logList = [];
    this._reporterList = [];
  }

  /**
   * 默认日志控制台打印等级为{@link LoggerLevel.DEBUG}, 日志等级与日志打印关系见{@link LoggerLevel}
   */
  private _level: LoggerLevel;

  /**
   * 储存的日志列表
   */
  private readonly _logList: Array<LogInfo>;
  get logList(): Array<LogInfo> {
    return this._logList;
  }

  private _reporterList: Array<Reporter>;
  /**
   * 保存{@link Reporter}打印的日志在{@link _logList}中的范围,
   *
   * key为{@link Reporter.instanceName}, value为第一条日志和最后一条日志在{@link _logList}中的下标.
   *
   * value为左开右闭区间, 即 `[firstLogIndex, lastLogIndex + 1]`
   *
   * @private
   */
  private _reporterLogRangeRecord: Record<string, [number, number]> = {};

  /**
   * @param className 类名
   * @param instanceName 实例名
   * @param level
   */
  createReporter(className: string, instanceName?: string, level: LoggerLevel = this._level): Reporter {
    const reporter = new Reporter(className, instanceName, level),
          range: [number, number] = [-1, -1];
    this._reporterList.push(reporter);

    this._reporterLogRangeRecord[reporter.instanceName] = range;

    reporter.onlog = (logStr: string, level: LoggerLevel, className: string, instanceName: string, formatStr: string, ...args: Array<unknown>) => {
      let shortLogStr = logStr;

      switch (level) {
        case LoggerLevel.DEBUG:
          if (logStr.length > 512) shortLogStr = `${logStr.substr(0, 512)}......`;
          break;
        case LoggerLevel.INFO:
        case LoggerLevel.WARN:
        case LoggerLevel.ERROR:
      }

      const log: LogInfo = {
        index: this._logList.length,
        ts: Date.now(),
        logStr,
        level,
        className,
        instanceName,
        formatStr,
        formatArgs: args
      };
      this._logList.push(log);
      // 更新日志索引范围下标值
      if (range[0] === -1) range[0] = log.index;
      range[1] = log.index + 1;

      if (reporter.level <= level) {
        this.dispatchEventLite(ReporterManagerEventType.LOG, {
          result: true,
          data: {
            ...log,
            logStr: shortLogStr
          }
        });
      }
    };

    return reporter;
  }

  /**
   * 设置日志等级
   */
  setLogLevel(level: LoggerLevel): LoggerLevel {
    this._level = level;

    for (let i = this._reporterList.length; i--;) {
      this._reporterList[i].level = level;
    }

    return this._level;
  }

  asTextBlob(): Blob | undefined {
    let result: Blob | undefined;

    if (typeIsTrue(isBrowser)) {
      const text = this._logList
        .map(({logStr, level, className, instanceName}) => `${timeString()} [${LoggerLevel[level]}] ${className}\t${instanceName}\t${logStr}`)
        .join('\n');

      result =  new Blob([text], {type: 'text/plain'});
    }

    return result;
  }

  /**
   * 通过{@link LogInfo.instanceName}搜索日志, 将返回一组以时间排序的{@link LogInfo}数组.
   *
   * @param instanceNames instanceName数组
   * @param start 搜索起始下标
   * @param end 搜索结束下标
   */
  filterByInstanceName(instanceNames: Array<string>, start?: number, end?: number): Array<LogInfo> {
    const logRanges = instanceNames
                        .map((i) => this._reporterLogRangeRecord[i])
                        .filter((range) => range[0] !== -1 && range[1] !== -1),
          result: Array<LogInfo> = [],
          startIndex = typeIsNumber(start)
                        ? start
                        : Math.min(/* 最小值保护 */0, ...logRanges.map((r) => r[0])),
          endIndex = typeIsNumber(end)
                        ? end
                        : Math.max(/* 最小值保护 */0, ...logRanges.map((r) => r[1])),
          instNameMap: Record<string, boolean> = {},
          logList = this._logList;

    for (let i = instanceNames.length; i--;) instNameMap[instanceNames[i]] = true;

    for (let i = startIndex; i < endIndex; i++) {
      const logInfo = logList[i];

      if (instNameMap[logInfo.instanceName]) {
        result.push(logInfo);
      }
    }

    return result;
  }
}

export const ReporterManagerInstance = new ReporterManager();

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
ReporterManagerInstance.onLog = (ev) => {
  const {logStr, level, className, instanceName} = ev.message?.data

  const str = [
    `${timeString()}\t%c[${LoggerLevel[level]}]`,
    `color: ${ReporterManager.LOGGER_LEVEL_COLOR[level]}`,
    `\t${className}\t${instanceName}\t${logStr}`
  ]

  switch (level) {
    case LoggerLevel.DEBUG:
      console.log(...str);
      break;
    case LoggerLevel.INFO:
      console.log(...str);
      break;
    case LoggerLevel.WARN:
      console.warn(...str);
      break;
    case LoggerLevel.ERROR:
      console.log(...str);
      break;
  }
};
