import {EventTarget} from "../lib";

describe('[class: TaskManager] usage case', function () {

  describe('test [function: addTask] usage case', function () {
    jest.setTimeout(3000);

    it('normal test', async () => {
      expect.hasAssertions();

      const eventTargetInstance = new EventTarget();
      const fn1 = jest.fn();

      eventTargetInstance.waitEvent('test')
        .then(() => {
          fn1()
          expect(fn1).toHaveBeenCalledTimes(1)
        });

      eventTargetInstance.dispatchEventLite('test');
    });
  });
});
