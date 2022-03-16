import {Reportable} from '../reporter-manager';

export class Constructable extends Reportable {
  /**
   * {@link ProxyManager}创建实例前执行
   */
  static beforeConstruct(): void {
    // todo
  }
}
