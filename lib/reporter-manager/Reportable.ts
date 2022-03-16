import {Reporter} from '../reporter';
import {EventTarget} from '../EventTarget';
import {ReporterManager, ReporterManagerInstance} from './ReporterManager';

export class Reportable<T = never> extends EventTarget<T> {
  static IGNORE_FUNCTION_MEMBER: Array<PropertyKey> = ['toString', 'addEventListener', 'toJSON'];
  static reporterManager: ReporterManager = ReporterManagerInstance;

  constructor() {
    super();

    this.__constructorName = (Reflect.getPrototypeOf(this) as (...args:  Array<unknown>) => unknown).constructor.name;
    this.reporter = ReporterManagerInstance.createReporter(
        this.__constructorName,
        (Reportable.ACCUMULATE_ID++).toString(10)
    );

    this._reportableInstanceIds = [];

    /**
     * Reporter自己创建时也将触发{@link 'reportable-instance-change'}事件.
     */
    Promise.resolve()
      .then(() => this._addReportableInstanceName(this.reporter.instanceName));
  }

  private readonly _reportableInstanceIds: Array<string>;
  get reportableInstanceIds(): Array<string> {
    return this._reportableInstanceIds;
  }

  protected static ACCUMULATE_ID = 0;

  readonly reporter: Reporter;

  readonly __constructorName: string;

  /**
   * 创建并添加{@link Reportable}子类的实例到{@link _reportableInstanceIds}
   * @param clazz
   * @param args
   * @protected
   * @internal
   */
  createReportableSubclassInstance<D extends Reportable, R extends new (...args: Array<unknown>) => D>(clazz: R, args?: ConstructorParameters<R>): InstanceType<R> {
    if (!Object.prototype.isPrototypeOf.call(Reportable, clazz)) throw new TypeError(`the class ${(clazz.name)}, not inherit [Reportable]`);

    const inst = Reflect.construct(clazz, args || []);
    this.addReportableInstance(inst);

    return inst;
  }

  /**
   * 添加{@link Reportable}子类的实例到{@link _reportableInstanceIds}
   * @param instance
   * @protected
   * @internal
   */
  addReportableInstance<D extends Reportable>(instance: D): void {
    instance['reportable-instance-change'] = (instanceName, type) => {
      switch (type) {
        case 0:
          this._addReportableInstanceName(instanceName);
          break;
        case 1:
          this._removeReportableInstanceName(instanceName);
          break;
      }
    };

    for (let i = instance.reportableInstanceIds.length; i--;) {
      this._addReportableInstanceName(instance.reportableInstanceIds[i]);
    }
  }

  /**
   * 从{@link _reportableInstanceIds}中移除{@link Reportable}子类的实例
   * @param instance
   * @protected
   * @internal
   */
  removeReportableInstance<D extends Reportable>(instance: D): void {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    instance['reportable-instance-change'] = () => {};

    for (let i = instance.reportableInstanceIds.length; i--;) {
      this._removeReportableInstanceName(instance.reportableInstanceIds[i]);
    }
  }

  private _addReportableInstanceName(instanceName: string): boolean {
    if (this._reportableInstanceIds.includes(instanceName)) return false;

    this._reportableInstanceIds.push(instanceName);
    this['reportable-instance-change'](instanceName, 0);

    return true;
  }

  private _removeReportableInstanceName(instanceName: string): boolean {
    const index = this._reportableInstanceIds.findIndex((id) => id === instanceName);

    if (index === -1) return false;

    this._reportableInstanceIds.splice(index, 1);
    this['reportable-instance-change'](instanceName, 1);

    return true;
  }

  /**
   * @internal
   * @callback {@link Reportable}的实例创建或销毁的事件回调
   *
   * {@link _reportableInstanceIds}保存该实例下所有{@link Reportable}
   * 实例的{@link Reportable.reporter.instanceName}.
   *
   * @param instanceName
   * @param type
   * 0: {@link instanceName}添加到{@link _reportableInstanceIds}中.
   * 1: {@link instanceName}从{@link _reportableInstanceIds}中移除.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected ['reportable-instance-change'](instanceName: string, type: 0 | 1): void {
    // todo
  }

  toString(): string {
    return `[object ${this.__constructorName}]`
  }
}
