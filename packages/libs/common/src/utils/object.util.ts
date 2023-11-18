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
  return value && typeof value === 'object' && value._bsontype && value._bsontype === 'ObjectID';
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
