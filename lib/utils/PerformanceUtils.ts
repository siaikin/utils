import {EnvironmentType, environmentType} from "./PlatformUtils";
import {typeIsFunction, typeIsNumber} from "./TypeUtils";
import {performance} from 'perf_hooks';

const markPointMap: Map<string, Record<number, number>> = new Map<string, Record<number, number>>();

/**
 * 设置标记点
 *
 * ```javascript
 * setMarkPoint('test', 0);
 * // setTimeout 10.1s
 * setMarkPoint('test', 1);
 * measureMarkPoint('test', 0, 1); // [10.1]
 * ```
 *
 * @param markName 标记名称, 仅用于分组
 * @param pointIndex 标记索引, 使用 {@link measureMarkPoint} 计算时长时需要传入
 */
export function setMarkPoint(markName: string, pointIndex: number): void {
  if (!markPointMap.has(markName)) markPointMap.set(markName, {});
  const indexes = markPointMap.get(markName) as Record<number, number>;

  switch (environmentType) {
    case EnvironmentType.BROWSER:
      indexes[pointIndex] = window.performance.now();
      break;
    case EnvironmentType.BROWSER_WORKER:
      indexes[pointIndex] = self.performance.now();
      break;
    case EnvironmentType.NODE:
    case EnvironmentType.NODE_THREAD:
      indexes[pointIndex] = performance.now();
      break;
    case EnvironmentType.UNKNOWN:
      if (typeof performance !== 'undefined' && typeIsFunction(performance.now)) {
        indexes[pointIndex] = performance.now();
      }
      break;
  }
}

/**
 * 计算多个标记点之间的时间间隔
 *
 * ```javascript
 * setMarkPoint('test', 0);
 * // setTimeout 10s
 * setMarkPoint('test', 1);
 * // setTimeout 20s
 * setMarkPoint('test', 2);
 * // setTimeout 30s
 * setMarkPoint('test', 3);
 *
 * measureMarkPoint('test', 0, 1); // [10]
 * measureMarkPoint('test', 0, 1, 2, 3); // [10, 20, 30]
 * measureMarkPoint('test', 0, 3); // [60]
 * ```
 *
 * @param markName 标记名称, 仅用于分组
 * @param startPointIndex 起始的标记索引, 即使用 {@link setMarkPoint} 时传入的索引
 * @param endPointIndex 结束的标记索引
 * @param pointIndex 可传入多个标记索引， 以一次性得到多个标记点之间的时间间隔
 */
export function measureMarkPoint(markName: string, startPointIndex: number, endPointIndex: number, ...pointIndex: Array<number>): Array<number> {
  const indexes = [startPointIndex, endPointIndex, ...pointIndex],
        len = indexes.length,
        pointIndexMap = markPointMap.get(markName) as Record<number, number>,
        result: Array<number> = [];

  if (!typeIsNumber(startPointIndex) || !typeIsNumber(pointIndexMap[startPointIndex])) throw new Error('point index 0 invalid');

  for (let i = 1, prevTS = pointIndexMap[startPointIndex]; i < len; i++) {
    const pointIndex = indexes[i],
          ts = pointIndexMap[pointIndex];
    if (!typeIsNumber(pointIndex) || !typeIsNumber(ts)) throw new Error(`point index ${i} invalid`);
    else result.push(ts - prevTS);
  }

  return result;
}

/**
 * 清除保存的标记点
 *
 * @param markName 标记名称, 仅用于分组
 * @param pointIndex 要清除的标记点, 不传则将 {@link markName} 下的所有标记点清除
 */
export function clearMarkPoint(markName: string, ...pointIndex: Array<number>): void {
  if (!markPointMap.has(markName)) return;

  if (pointIndex.length <= 0) {
    markPointMap.set(markName, {});
  } else {
    const indexes = markPointMap.get(markName) as Record<number, number>;
    for (let i = pointIndex.length; i--;) delete indexes[pointIndex[i]];
  }
}
