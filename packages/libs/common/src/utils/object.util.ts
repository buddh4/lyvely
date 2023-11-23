import { Type } from './util.types';
import { isDefined } from 'class-validator';

const BLACKLISTED_PATH = [
  '__proto__',
  'prototype',
  'constructor',
  'valueOf',
  'toString',
  'hasOwnProperty',
];

export function isBlacklistedProperty(prop: string) {
  if (prop.startsWith('__') && prop.endsWith('__')) return true;
  return BLACKLISTED_PATH.includes(prop);
}

/**
 * Type guard function to check if a value is a plain object.
 * @param value - The value to check.
 * @returns True if the value is a plain object, false otherwise.
 */
export function isPlainObject<T extends object = Record<PropertyKey, unknown>>(
  value: any,
): value is T {
  return !!value && getToStringType(value) === '[object Object]';
}

/**
 * Helper function to get a string representing the object's type.
 * @param value - The value to get the type string for.
 * @returns The type string of the value.
 */
function getToStringType(value: any): string {
  return Object.prototype.toString.call(value);
}

/**
 * Type guard function to check if a given value is a plain object and if the specified property
 * exists as an own non-null and non-undefined value. This also acts as a type guard for the value being
 * a plain object with a known property.
 * @param obj - The value to check.
 * @param property - The property name to check for.
 * @returns True if the value is a plain object and the property exists with a non-null and non-undefined value.
 */
export function hasOwnNonNullableProperty<
  T extends object = Record<PropertyKey, unknown>,
  K extends keyof T = keyof T,
>(obj: any, property: K): obj is T & { [P in K]: unknown } {
  return isPlainObject(obj) && Object.hasOwn(obj, property) && obj[property] != null;
}

/**
 * Type guard function to check if a given value is a plain object and if the specified property
 * exists as a non-null and non-undefined value. This also acts as a type guard for the value being
 * a plain object with a known property.
 * @param obj - The value to check.
 * @param property - The property name to check for.
 * @returns True if the value is a plain object and the property exists with a non-null and non-undefined value.
 */
export function hasNonNullableProperty<
  T extends object = Record<PropertyKey, unknown>,
  K extends keyof T = keyof T,
>(obj: any, property: K): obj is T & { [P in K]: unknown } {
  return isPlainObject(obj) && !!obj[property];
}

/**
 * Returns the given property from value in case obj is a plain object owning the given property or a default value or
 * null if those conditions are not met.
 * @param value - The value to check.
 * @param property - The property name to check for.
 * @param defaultValue A default value returned if the conditions are not met.
 * @returns True if the object is a plain object and the property exists and is owned by the object with a non-null and non-undefined value.
 */
export function getOwnNonNullableProperty<T extends object = any, K extends keyof T = keyof T>(
  value: any,
  property: K,
  defaultValue?: T[K],
): T[K] | null {
  return hasOwnNonNullableProperty<T, K>(value, property) ? value[property] : defaultValue || null;
}

/**
 * Returns the given property from obj in case value is a plain object with existing (not owning) the given property
 * or a default value or null if those conditions are not met.
 * @param value - The value to check.
 * @param property - The property name to check for.
 * @param defaultValue A default value returned if the conditions are not met.
 * @returns True if the value is a plain object and the property exists with a non-null and non-undefined value.
 */
export function getNonNullableProperty<T extends object = any, K extends keyof T = keyof T>(
  value: any,
  property: K,
  defaultValue?: T[K],
): T[K] | null {
  return hasNonNullableProperty<T, K>(value, property) ? value[property] : defaultValue || null;
}

export function findByPath<T>(
  model: any,
  path: string,
  parent = false,
  create = true,
): T | undefined {
  if (!path.includes('.')) {
    return parent ? model : model[path];
  }

  path = parent ? path.replace(/\.[^/.]+$/, '') : path;

  let result = model as any | undefined;
  const subPaths = path.split('.');
  subPaths.forEach((sub, index) => {
    if (isBlacklistedProperty(sub)) throw new Error('Tried to access blacklisted property');

    if ((sub && sub.length && sub.charAt(0) === '$') || /^[0-9]+$/.test(sub)) {
      // we do not support mongodb special cases e.g. array etc.
      result = undefined;
    } else if (result && !result[sub] && create && index !== subPaths.length) {
      result[sub] = {};
    }
    result = isDefined(result?.[sub]) ? result[sub] : undefined;
  });
  return result;
}

export function isObjectId(value: any): value is object {
  return getNonNullableProperty(value, '_bsontype') === 'ObjectId';
}

export function getPrototypeTree(type: Type): Array<Type> {
  let curr = type;
  const prototypeTree = [type];

  do {
    curr = Object.getPrototypeOf(curr);
    if (Object.getPrototypeOf(curr) === Object.prototype) break;
    prototypeTree.push(curr);
  } while (curr);

  return prototypeTree;
}

export function useSingleton<T>(create: () => T) {
  let instance: T;
  return <TR extends T = T>(): TR => {
    if (!instance) {
      instance = create();
    }

    return instance as TR;
  };
}
