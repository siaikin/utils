import {TaskManagerInstance} from "../../lib";

describe('[class: TaskManager] usage case', function () {
  describe('test [function: addTask] usage case', function () {
    jest.setTimeout(3000);

    it('normal test', () => {
      const fn1 = jest.fn();
      TaskManagerInstance.addTask('test1', fn1, {interval: 1000});

      return new Promise<void>((resolve) => {
        setTimeout(() => {
          expect(fn1).toHaveBeenCalledTimes(2);
          resolve();
        }, 2100);
      });
    });
  });
});
