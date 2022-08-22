/*
 * @Author: lyu
 * @Date: 2022-08-22 10:26:46
 */

import { EnumDataType } from '../enum';

export function isBoolean(data: unknown) {
  return Object.prototype.toString.call(data) === EnumDataType.boolean;
}
export function isFunction(data: unknown) {
  const dataType = Object.prototype.toString.call(data)
  return dataType === EnumDataType.func || dataType === EnumDataType.asyncFunc;
}

export function isPromise(data: unknown) {
  return Object.prototype.toString.call(data) === EnumDataType.promise;
}