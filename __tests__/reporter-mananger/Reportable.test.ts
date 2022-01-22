import {Reportable} from "../../lib";

describe('[class: Reportable] usage case', function () {
  class BaseTestClass extends Reportable {
    testInst: BaseTestClass;

    removeTestInst(): void {
      this.removeReportableInstance(this.testInst);
    }
  }

  class SyncTestClass extends BaseTestClass {
    constructor() {
      super();
      this.testInst = new BaseTestClass();
      this.addReportableInstance(this.testInst);
    }
  }

  class AsyncTestClass extends BaseTestClass {
    syncInst: SyncTestClass;

    constructor(timeout = 0) {
      super();

      this.syncInst = new SyncTestClass();
      this.addReportableInstance(this.syncInst);
      setTimeout(() => {
        this.testInst = new BaseTestClass();
        this.addReportableInstance(this.testInst);
      }, timeout);
    }

    removeSyncInst(): void {
      this.removeReportableInstance(this.syncInst);
    }
  }

  class Test extends Reportable {
    syncInst: SyncTestClass;
    asyncInst: AsyncTestClass;
    /**
     * 通过{@link Reportable.createReportableSubclassInstance}接口创建的实例
     */
    createdByCreateReportableSubclassInstanceInst: SyncTestClass;

    constructor() {
      super();
      this.syncInst = new SyncTestClass();
      this.addReportableInstance(this.syncInst);
      this.asyncInst = new AsyncTestClass();
      this.addReportableInstance(this.asyncInst);
      this.createdByCreateReportableSubclassInstanceInst = this.createReportableSubclassInstance(SyncTestClass);
    }
  }

  /**
   * 测试Reportable的instanceName收集功能
   */
  describe('L1IT_CollectInstanceName', function () {
    it('test collect instance name', async () => {
      const test = new Test();

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(test.reportableInstanceIds.sort()).toMatchObject([
        test.reporter.instanceName,
        test.syncInst.reporter.instanceName,
        test.syncInst.testInst.reporter.instanceName,
        test.asyncInst.reporter.instanceName,
        test.asyncInst.syncInst.reporter.instanceName,
        test.asyncInst.syncInst.testInst.reporter.instanceName,
        test.asyncInst.testInst.reporter.instanceName,
        test.createdByCreateReportableSubclassInstanceInst.reporter.instanceName,
        test.createdByCreateReportableSubclassInstanceInst.testInst.reporter.instanceName,
      ].sort());

      test.asyncInst.removeSyncInst();

      expect(test.reportableInstanceIds.sort()).toMatchObject([
        test.reporter.instanceName,
        test.syncInst.reporter.instanceName,
        test.syncInst.testInst.reporter.instanceName,
        test.asyncInst.reporter.instanceName,
        test.asyncInst.testInst.reporter.instanceName,
        test.createdByCreateReportableSubclassInstanceInst.reporter.instanceName,
        test.createdByCreateReportableSubclassInstanceInst.testInst.reporter.instanceName,
      ].sort());
    })
  });

  describe('L1IT_CollectInstanceName_Abnormal', function () {
    it('test collect instance name abnormal', async () => {
      class AbnormalTest extends Test {
        addExistInstanceName(): void {
          this.addReportableInstance(this.syncInst);
        }

        removeNotExistInstanceName(): void {
          this.removeReportableInstance(new Test());
        }
      }

      const abnormalTest = new AbnormalTest();

      await new Promise((resolve) => setTimeout(resolve, 100));

      const originInstanceNameList = abnormalTest.reportableInstanceIds.slice().sort();

      abnormalTest.addExistInstanceName();

      expect(abnormalTest.reportableInstanceIds.sort()).toMatchObject(originInstanceNameList);

      abnormalTest.removeNotExistInstanceName();

      expect(abnormalTest.reportableInstanceIds.sort()).toMatchObject(originInstanceNameList);
    })
  });

  /**
   * 测试{@link Reportable.toString}接口
   */
  describe('L4UT_InvokeToString', function () {
    it('should return [object ClassName]', function () {
      const test = new Test();

      expect(test.toString()).toEqual('[object Test]');
    });
  });
})