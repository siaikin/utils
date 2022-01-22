import {Task} from "./Task";
import {TaskOptions, TaskFunction} from "./ITaskManager";

class TaskManager {
  private readonly _grained: number;
  private readonly _waitingQueue: Array<Task>
  private _lastLoopTimestamp: number;
  private _intervalKey?: ReturnType<typeof setInterval>;

  constructor(grained = 100) {
    this._grained = grained;
    this._waitingQueue = [];
  }

  start(): void {
    this._lastLoopTimestamp = Date.now();

    this._intervalKey = setInterval(() => {
      const ts = Date.now(), delta = ts - this._lastLoopTimestamp;
      for (let i = this._waitingQueue.length, task: Task; i--, task = this._waitingQueue[i];) {
        if (task.isEnable() && task.calcRemaining(delta)) {
          task.executeTask();
        }
      }
      this._lastLoopTimestamp = ts;
    }, this._grained);
  }

  stop(): void {
    if (this._intervalKey) {
      clearInterval(this._intervalKey);
      this._intervalKey = undefined;
    }
  }

  /**
   * 添加定时任务
   * @param name 定时任务名, 同名任务将被覆盖, 传入空字符串将随机生成一个任务名称
   * @param func
   * @param options
   */
  addTask(name: string, func: TaskFunction, options: Partial<Omit<TaskOptions, 'func'>> = {}): void {
    let task = this._waitingQueue.find((task) => task.name === name);

    if (!task) {
      task = new Task({name, func, ...options});
      this._waitingQueue.push(task);
    } else {
      task.reset({func, ...options});
    }
  }

  removeTask(name: string): boolean {
    const task = this._waitingQueue.find((task) => {
      return task.name === name;
    });
    if (!task) return false;

    task.stop();
    return true;
  }
}

export const TaskManagerInstance = new TaskManager();
TaskManagerInstance.start();
