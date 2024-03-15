import { UpdateQuery, createObjectId, isObjectId, TObjectId } from './db.type';
import { BaseDocument } from './base.document';
import {
  isValidObjectId,
  DeepPartial,
  Type,
  findByPath,
  assignRawDataTo,
  hasOwnNonNullableProperty,
  initBaseModelData,
} from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';

export type DocumentIdentity<T extends BaseDocument<any>> = T | TObjectId | string;

export type EntityData<T> = Omit<T, '_id' | 'id' | '__v'>;

// We use any here since we need to use this when defining sub documents
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: DocumentIdentity<T> | undefined | null,
  optional?: false,
): TObjectId;
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: DocumentIdentity<T> | undefined | null,
  optional: true,
): TObjectId | undefined;
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: DocumentIdentity<T> | undefined | null,
  optional?: boolean,
): TObjectId {
  if (!identity && optional) return undefined as any;

  if (typeof identity === 'string') {
    if (isValidObjectId(identity)) {
      return createObjectId(identity);
    }
    throw new IntegrityException('Use of invalid object id detected.');
  }

  if (isObjectId(identity)) {
    // Somehow type guards are not working here...
    return identity as TObjectId;
  }

  if (
    identity &&
    '_id' in identity &&
    (typeof identity['_id'] === 'string' || isObjectId(identity['_id']))
  ) {
    return assureObjectId(identity['_id']);
  }

  if (identity && 'id' in identity && typeof identity['id'] === 'string') {
    return assureObjectId(identity['id']);
  }

  throw new IntegrityException('Use of invalid object id detected.');
}

export function applyUpdateTo<T extends BaseDocument<any>>(
  identity: DocumentIdentity<T>,
  update: UpdateQuery<T>,
) {
  if (typeof identity !== 'object') {
    return;
  }

  if ('$inc' in update) {
    applyInc(identity, update['$inc'] as Record<string, number>);
  }

  if ('$set' in update) {
    assignRawDataTo(identity, update['$set']);
  }

  if ('$push' in update) {
    applyPush(identity, update['$push'] as any);
  }
}

/**
 * Helper function to increment multiple integer values of an object by property path in place:
 *
 * Example usage:
 *
 * const model = { sub: { sub: { field1: 0, field2: 0 } } };
 * applyInc(model, { 'sub.sub.field1': 1, 'sub.sub.field2': 1 });
 *
 * @param model
 * @param incData
 */
export function applyInc<T extends object = object>(model: T, incData: Record<string, number>) {
  Object.keys(incData).forEach((path) => {
    // Make sure we do not try to push complex query strings
    if (path.indexOf('$') >= 0) return;
    if (typeof incData[path] !== 'number') return;

    let modelToInc: T | undefined = model;
    let fieldToInc = path;

    if (path.includes('.') && path.lastIndexOf('.') !== path.length - 1) {
      fieldToInc = path.slice(path.lastIndexOf('.') + 1);
      modelToInc = findByPath<T>(model, path, {
        returnParent: true,
        create: true,
        defaultValue: 0,
      });
    }

    if (modelToInc && typeof modelToInc[fieldToInc] === 'number') {
      modelToInc[fieldToInc] += incData[path];
    }
  });
}

export function applyPush<T extends object>(
  model: T,
  pushData: { [key in string | `${string}.${string}`]?: any },
): T {
  Object.keys(pushData).forEach((key) => {
    // Make sure we do not try to push complex query strings
    if (key.indexOf('$') >= 0) return;
    const arrayToPush = findByPath<Array<any>>(model, key, { create: true, defaultValue: [] });

    if (
      hasOwnNonNullableProperty(pushData[key], '$each') &&
      Array.isArray(pushData[key][`$each`])
    ) {
      arrayToPush.push(...pushData[key][`$each`]);
    } else {
      arrayToPush.push(pushData[key]);
    }
    // TODO: support $sort and $slice
  });

  return model;
}

export function assureStringId(obj: any | undefined, optional?: false): string;
export function assureStringId(obj: any | undefined, optional: true): string | undefined;
export function assureStringId(obj: any | undefined, optional?: boolean): string {
  if (!obj && !optional) {
    throw new IntegrityException('Cannot assure string id on undefined.');
  } else if (!obj) {
    return undefined as any;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  if (isObjectId(obj)) {
    return obj.toString();
  }

  if (obj._id) {
    return obj._id.toString();
  }

  if (!optional) return undefined as any;

  throw new IntegrityException('Use of invalid object id detected.');
}

export function createBaseDocumentInstance<T>(constructor: Type<T>, data: DeepPartial<T>) {
  return BaseDocument.init(Object.create(constructor.prototype), data);
}
