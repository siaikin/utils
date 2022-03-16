import {AllowDataType, IStorage} from './IStorage';
import {isBrowser, isWeChat} from '../utils';
import {WebStorage} from './WebStorage';
import {WeChatMiniprogramStorage} from './WeChatMiniprogramStorage';

class StorageManager {
  private static STORAGE_KEY = 'SIAIKIN_StorageManager';

  storage: IStorage;

  constructor() {
    if (isBrowser) {
      this.storage = new WebStorage(StorageManager.STORAGE_KEY);
    } else if (isWeChat) {
      this.storage = new WeChatMiniprogramStorage(StorageManager.STORAGE_KEY);
    }
  }

  clear(): void {
    return this.storage.clear();
  }

  get(key: string): AllowDataType {
    return this.storage.get(key);
  }

  remove(key: string): void {
    return this.storage.remove(key);
  }

  set(key: string, value: AllowDataType): void {
    return this.storage.set(key, value);
  }
}

export const StorageManagerInstance = new StorageManager();
