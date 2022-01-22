/**
 * 将T中的K属性设为可选
 */
export type PartPartial<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>;
/**
 * 将T中的K属性设为必须, 且除K以外的属性设为可选
 */
export type PartRequired<T, K extends keyof T> = Partial<Pick<T, Exclude<keyof T, K>>> & Required<Pick<T, K>>;
