import { UpdateQuery, createObjectId, isObjectId, TObjectId } from './db.type';
import { BaseDocument, assignEntityData } from './base.document';
import {
  isValidObjectId,
  DeepPartial,
  Type,
  findByPath,
  assignRawDataTo,
  hasOwnNonNullableProperty,
} from '@lyvely/common';
import { IntegrityException } from '@lyvely/interface';

export type EntityIdentity<T extends BaseDocument<any>> = T | TObjectId | string;

export type EntityData<T> = Omit<T, '_id' | 'id' | '__v'>;

// We use any here since we need to use this when defining sub documents
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: EntityIdentity<T> | undefined | null,
  optional?: false,
): TObjectId;
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: EntityIdentity<T> | undefined | null,
  optional: true,
): TObjectId | undefined;
export function assureObjectId<T extends BaseDocument<any> = BaseDocument<any>>(
  identity: EntityIdentity<T> | undefined | null,
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
  identity: EntityIdentity<T>,
  update: UpdateQuery<T>,
) {
  if (typeof identity !== 'object') {
    return;
  }

  if ('$inc' in update) {
    applyInc(identity, update['$inc'] as Record<string, number>);
  }

  if ('$set' in update) {
    applyRawDataTo(identity, update['$set'] as any);
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
    if (typeof incData[path] !== 'number') return;

    let modelToInc: T | undefined = model;
    let fieldToInc = path;

    if (path.includes('.') && path.lastIndexOf('.') !== path.length - 1) {
      fieldToInc = path.slice(path.lastIndexOf('.') + 1);
      modelToInc = findByPath<T>(model, path, true);
    }

    if (modelToInc && typeof modelToInc[fieldToInc] === 'number') {
      modelToInc[fieldToInc] += incData[path];
    }
  });
}

export function applyPush<T>(model: T, pushData: { [key in keyof T]?: any }): T {
  // TODO: support path
  Object.keys(pushData).forEach((key) => {
    if (typeof model[key] === 'undefined') {
      model[key] = [];
    }

    if (
      hasOwnNonNullableProperty(pushData[key], '$each') &&
      Array.isArray(pushData[key][`$each`])
    ) {
      model[key] = [...model[key], ...pushData[key][`$each`]];
    } else {
      model[key].push(pushData[key]);
    }
    // TODO: support $sort and $slice
  });

  return model;
}

export function applyRawDataTo<T extends Object>(
  model: T,
  data: { [key in keyof T]?: any },
  { maxDepth = 100, strict = false } = {},
): T {
  return assignRawDataTo(model, data, { maxDepth, strict });
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
  const model = Object.create(constructor.prototype);
  if (typeof model.init === 'function') {
    model.init(data);
  } else {
    assignEntityData(model, data);
  }
  return model;
}
