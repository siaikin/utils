export type AllowDataType = number | string | boolean | undefined | null | Date | Record<string | number, unknown>;

export interface IStorage {
  cache: Record<string | number, AllowDataType>;
  storageName: string;
  get(key: string): AllowDataType;
  set(key: string, value: AllowDataType): void;
  remove(key: string): void;
  clear(): void;
}
