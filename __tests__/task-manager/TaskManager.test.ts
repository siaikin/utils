import {TaskManagerInstance} from "../../lib";

describe('[class: TaskManager] usage case', function () {
  describe('test [function: addTask] usage case', function () {
    it('', () => {
      jest.setTimeout(1200);
      const fn1 = jest.fn();
      const fn2 = jest.fn();
      TaskManagerInstance.addTask('test1', fn1, {interval: 500});
      TaskManagerInstance.addTask('test2', fn2, {interval: 500});

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(fn1).toHaveBeenCalledTimes(2);
          expect(fn2).toHaveBeenCalledTimes(2);
          resolve();
        }, 1100);
      });
    });
  });
});
