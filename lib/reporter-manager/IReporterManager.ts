import {Reporter, LoggerLevel} from '../reporter';

export interface IReporterManager {
  createReporter(className: string, instanceName?: string, level?: LoggerLevel): Reporter;
}

export interface ReportInfo {
  logList: Array<LogInfo>;
  [key: string]: unknown;
}

/**
 * 日志信息类型定义
 */
export interface LogInfo extends Record<string, unknown>{
  /**
   * 索引下标
   */
  index: number;
  /**
   * timestamp
   */
  ts: number;
  logStr: string;
  level: LoggerLevel;
  className: string;
  instanceName: string;
  formatStr: string;
  formatArgs: Array<unknown>;
}
