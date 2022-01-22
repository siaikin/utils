import {Task} from "./Task";

export type TaskFunction = (task: Task) => unknown;

export interface TaskOptions {
  name: string;
  func: TaskFunction;
  interval: number;
  immediate: boolean;
}
