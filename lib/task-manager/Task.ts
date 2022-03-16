import {TaskFunction, TaskOptions} from './ITaskManager';
import {randomString} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nothing: TaskFunction = (task: Task) => {return;};

export class Task {
  private static DEFAULT_TASK_OPTIONS: TaskOptions = {
    name: randomString(8),
    func: nothing,
    interval: 1000,
    immediate: false
  };

  private _enable: boolean;
  private _remaining: number;

  options: TaskOptions;
  name: string;

  constructor(options: Partial<TaskOptions>) {
    this._enable = false;
    this.reset(options);
  }

  reset(options: Partial<TaskOptions>): void {
    this.start();
    this.options = {
      ...(this.options || Task.DEFAULT_TASK_OPTIONS),
      ...options
    };

    this.name = this.options.name || randomString(8);

    this._remaining = this.options.interval;

    if (this.options.immediate) this.options.func(this);
  }

  isEnable(): boolean {
    return this._enable;
  }

  start(): void {
    this._enable = true;
  }

  stop(): void {
    this._enable = false;
  }

  calcRemaining(delta: number): boolean {
    let executable = false;
    this._remaining -= delta;
    if (this._remaining <= 0) {
      executable = true;
      this._remaining = this.options.interval;
    }

    return executable;
  }

  executeTask(): void {
    this.options.func(this);
  }
}
