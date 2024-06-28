import { Type } from './util.types';
import _ from './custom-lodash';

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
  value: any
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
  defaultValue?: T[K]
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
  defaultValue?: T[K]
): T[K] | null {
  return hasNonNullableProperty<T, K>(value, property) ? value[property] : defaultValue || null;
}

/**
 * Checks if a value is null or undefined
 *
 * @param {any} value - The value to be checked
 * @return {boolean} - true if the value is null or undefined, false otherwise
 */
export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Checks if a value is not null or undefined
 *
 * @param {any} value - The value to be checked
 * @return {boolean} - true if the value is null or undefined, false otherwise
 */
export function isNotNil<TVal = any>(value: TVal | null | undefined): value is TVal {
  return !isNil(value);
}

interface FindByPathOptions {
  returnParent?: boolean;
  create?: boolean;
  defaultValue?: any;
}

interface FindByPathCreateOptions {
  returnParent?: boolean;
  create?: true;
  defaultValue?: any;
}

/**
 * Finds a value in the given model object using the specified path.
 *
 * By setting the create option to true, the given path will be created by means of plain objects and the
 * defaultValue if given (otherwise only plain objects).
 *
 * If the returnParent option is set to true this function will not directly return the value of the path but the parent.
 *
 * When setting a defaultValue, this function will return the defaultValue in case the path does not exist on the model
 * and furthermore set the defaultValue in case the create option is set to true.
 *
 * @param {Record<string, any> | undefined | null} model - The model object to search.
 * @param {string} path - The path to the value.
 * @param {FindByPathCreateOptions} options - The options to customize the search behavior.
 * @returns {T} The value found at the specified path.
 */
export function findByPath<T>(
  model: Record<string, any> | undefined | null,
  path: string,
  options: FindByPathCreateOptions
): T;
export function findByPath<T>(
  model: Record<string, any> | undefined | null,
  path: string,
  options?: FindByPathOptions
): T | undefined;
export function findByPath<T>(
  model: Record<string, any> | undefined | null,
  path: string,
  options?: FindByPathOptions
): T | undefined {
  if (!path.includes('.')) {
    if (isBlacklistedProperty(path)) throw new Error('Tried to access blacklisted property');
    const result = options?.returnParent ? model : model?.[path];
    if (result || !options?.create) return result || options?.defaultValue;
    model ??= {};
    model[path] = options?.defaultValue || {};
    return options?.returnParent ? model : model[path];
  }

  path = options?.returnParent ? path.replace(/\.[^/.]+$/, '') : path;

  let result = (model || {}) as any | undefined | null;

  const subPaths = path.split('.');
  subPaths.forEach((sub, index) => {
    if (isBlacklistedProperty(sub)) throw new Error('Tried to access blacklisted property');

    if ((sub && sub.length && sub.charAt(0) === '$') || /^[0-9]+$/.test(sub)) {
      // we do not support mongodb special cases e.g. array etc.
      result = undefined;
    } else if (result && !result[sub] && options?.create && index !== subPaths.length) {
      result[sub] = index !== subPaths.length - 1 ? {} : options?.defaultValue || {};
    }
    result = isNotNil(result?.[sub]) ? result[sub] : undefined;
  });

  return result ?? options?.defaultValue;
}

/**
 * Checks if the given value is an ObjectId.
 *
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is an ObjectId, otherwise returns false.
 */
export function isObjectId(value: any): value is object {
  return getNonNullableProperty(value, '_bsontype') === 'ObjectId';
}

/**
 * Retrieves the prototype tree of a given type.
 *
 * @param {Type} type - The type to retrieve the prototype tree for.
 * @return {Array<Type>} - The prototype tree of the given type, including the type itself.
 */
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

/**
 * Creates and returns a singleton instance of a given type.
 *
 * @template T The type of the singleton instance.
 * @param {() => T} create A function that creates the singleton instance.
 * @returns {<TR extends T = T>() => TR} A function that returns the singleton instance.
 */
export function useSingleton<T>(create: () => T) {
  let instance: T;
  return <TR extends T = T>(): TR => {
    if (!instance) {
      instance = create();
    }

    return instance as TR;
  };
}

/**
 * Clones an object by creating a shallow copy of the provided object.
 *
 * @param {TModel} obj - The object to clone.
 * @returns {TModel} - A shallow copy of the provided object.
 */
export function clone<TModel = any>(obj: TModel): TModel {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

/**
 * Checks if the given object is empty.
 *
 * @param {object} obj - The object to check for emptiness.
 * @return {boolean} - True if the object is empty, false otherwise.
 */
export function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0;
}

/**
 * Omit properties from an object and return a new object without the omitted properties.
 *
 * @param {Object} obj - The object from which properties are to be omitted.
 * @param paths
 * @returns {Object} - A new object without the omitted properties.
 */
export function omit<T extends object, K extends Array<string | number | symbol>>(
  obj: T | null | undefined,
  ...paths: K
): Pick<T, Exclude<keyof T, K[number]>>;
export function omit<T extends object, K extends keyof T>(
  obj: T | null | undefined,
  ...paths: K[]
): Omit<T, K>;
export function omit<T extends object>(
  obj: T | null | undefined,
  ...paths: Array<string | number | symbol>
): Partial<T>;
export function omit<T extends object, K extends Array<keyof T>>(
  obj: T | null | undefined,
  ...paths: K
): Partial<T> {
  if (!obj) return {};
  const newObj = { ...obj };
  if (!paths?.length) return newObj;
  paths.forEach((key) => delete newObj[key]);
  return newObj;
}

/**
 * Picks the specified properties from an object and returns a new object with only those properties.
 *
 * @return {Object} - A new object with only the picked properties.
 * @param obj
 * @param props
 */
export function pick<T extends object, U extends keyof T>(obj: T, ...props: U[]): Pick<T, U>;
export function pick<T>(
  obj: T | null | undefined,
  ...props: Array<string | number | symbol>
): Partial<T>;
export function pick<T extends object, K extends Array<keyof T>>(
  obj: T | null | undefined,
  ...paths: K
): Partial<T> {
  if (!obj) return {};
  if (!paths?.length) return {};
  return paths.reduce((acc: any, key: keyof T) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

/**
 * Checks if two values are equal.
 *
 * @param {any} value - The first value to compare.
 * @param {any} other - The second value to compare.
 * @return {boolean} - Returns `true` if the values are equal, otherwise `false`.
 */
export function isEqual(value: any, other: any): boolean {
  return _.isEqual(value, other);
}

/**
 * Creates a deep clone of the given value.
 *
 * @param {T} value - The value to be deep cloned.
 * @returns {T} - A deep clone of the given value.
 */
export function cloneDeep<T>(value: T): T {
  return _.cloneDeep(value);
}

/**
 * Creates a deep clone of a value with custom cloning behavior.
 *
 * @param {T} value - The value to clone.
 * @param {_.CloneDeepWithCustomizer<T>} customizer - The function to customize cloning behavior.
 * @return {TResult} - The deep cloned value.
 */
export function cloneDeepWith<T, TResult = any>(
  value: T,
  customizer: _.CloneDeepWithCustomizer<T>
): TResult {
  return _.cloneDeepWith(value, customizer);
}

/**
 * Escapes special characters in a regular expression string.
 *
 * @param {string} regexp - The regular expression to escape.
 * @return {string} - The escaped regular expression string.
 */
export function escapeRegExp(regexp: string): string {
  return _.escapeRegExp(regexp);
}

/**
 * Generates a unique identifier by appending a prefix to a unique number.
 *
 * @param {string} prefix - The prefix to be added to the unique number.
 * @return {string} The unique identifier.
 */
export function uniqueId(prefix: string): string {
  return _.uniqueId(prefix);
}

/**
 * Merges the properties of the source object into the target object and returns the result.
 *
 * @template TObject - The type of the target object.
 * @template TSource - The type of the source object.
 * @param {TObject} object - The target object to merge into.
 * @param {TSource} source - The source object whose properties will be merged into the target object.
 * @returns {TObject & TSource} - The merged object with properties from both the target and source objects.
 */
export function merge<TObject, TSource>(object: TObject, source: TSource): TObject & TSource;
export function merge<TObject, TSource1, TSource2>(
  object: TObject,
  source1: TSource1,
  source2: TSource2
): TObject & TSource1 & TSource2;
export function merge<TObject, TSource1, TSource2, TSource3>(
  object: TObject,
  source1: TSource1,
  source2: TSource2,
  source3: TSource3
): TObject & TSource1 & TSource2 & TSource3;
export function merge<TObject, TSource1, TSource2, TSource3, TSource4>(
  object: TObject,
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4
): TObject & TSource1 & TSource2 & TSource3 & TSource4;
export function merge(object: any, ...otherArgs: any[]): any;
export function merge(object: any, ...otherArgs: any[]): any {
  return _.merge(object, ...otherArgs);
}
