import {AllowDataType} from './IStorage';
import {typeIsObject} from '../utils';
import {WebStorage} from './WebStorage';

export class WeChatMiniprogramStorage extends WebStorage {
  cache: Record<string | number, AllowDataType>;
  storageName: string;

  constructor(storageName: string) {
    super(storageName);
  }

  protected _init(): void {
    const initData = wx.getStorageSync(this.storageName);
    if (typeIsObject(initData)) {
      this.cache = initData as Record<string | number, AllowDataType>;
    }
  }

  protected _refreshPlatformStorage(): void {
    wx.setStorageSync(this.storageName, this.cache);
    this.cache = wx.getStorageSync(this.storageName);
  }
}
