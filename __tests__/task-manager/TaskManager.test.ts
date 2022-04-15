import {TaskManager} from '../../lib';

function createTaskManager() {
  const taskManagerInstance = new TaskManager();
  taskManagerInstance.start();

  return taskManagerInstance;
}

describe('[class: TaskManager] usage case', function () {

  describe('test [function: addTask] usage case', function () {
    jest.setTimeout(3000);

    it('normal test', async () => {
      expect.hasAssertions();

      const taskManagerInstance = createTaskManager();
      const fn1 = jest.fn();
      taskManagerInstance.addTask('test1', fn1, {interval: 1000});

      await new Promise<void>((resolve) => setTimeout(resolve, 2900));

      expect(fn1).toHaveBeenCalledTimes(2);
    });
  });
});
