import {AllowDataType, IStorage} from "./IStorage";
import {notUAN, typeIsObject, typeIsString} from "../utils";

export class WebStorage implements IStorage {
  cache: Record<string | number, AllowDataType>;
  storageName: string;
  storage: Storage;

  constructor(storageName: string) {
    this.cache = {};
    this.storageName = storageName;

    this._init();
  }

  clear(): void {
    this.cache = {};
    this._refreshPlatformStorage();
  }

  get(key: string): AllowDataType {
    const value = this.cache[key];
    return notUAN(value) ? value : undefined;
  }

  remove(key: string): void {
    if (notUAN(this.cache[key])) {
      delete this.cache[key];
      this._refreshPlatformStorage();
    }
  }

  set(key: string, value: AllowDataType): void {
    this.cache[key] = value;
    this._refreshPlatformStorage();
  }

  protected _init(): void {
    this.storage = localStorage;
    const initData = this.storage.getItem(this.storageName);

    if (typeIsString(initData)) {
      try {
        this.cache = JSON.parse(initData) as Record<string | number, AllowDataType>;
      } catch (e) {
        this.cache = {};
        throw e;
      }
    }
  }

  protected _refreshPlatformStorage(): void {
    this.storage.setItem(this.storageName, JSON.stringify(this.cache));
    const temp = this.storage.getItem(this.storageName);

    if (typeIsString(temp)) {
      this.cache = JSON.parse(temp);
    }
  }
}
