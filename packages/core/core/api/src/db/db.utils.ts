import { Document, Types, UpdateQuery } from 'mongoose';
import { BaseEntity, assignEntityData } from './base.entity';
import { isValidObjectId, DeepPartial, Type, findByPath, IntegrityException } from '@lyvely/common';
import { assignRawDataTo } from '@lyvely/common';

export type EntityIdentity<T extends BaseEntity<any>> =
  | T
  | Types.ObjectId
  | string
  | (Document & T);

export type EntityData<T> = Omit<T, '_id' | 'id' | '__v'>;

// We use any here since we need to use this when defining sub documents
export function assureObjectId<T extends BaseEntity<any> = BaseEntity<any>>(
  identity: EntityIdentity<T> | undefined,
  optional?: false,
): Types.ObjectId;
export function assureObjectId<T extends BaseEntity<any> = BaseEntity<any>>(
  identity: EntityIdentity<T> | undefined,
  optional: true,
): Types.ObjectId | undefined;
export function assureObjectId<T extends BaseEntity<any> = BaseEntity<any>>(
  identity: EntityIdentity<T> | undefined,
  optional?: boolean,
): Types.ObjectId {
  if (!identity && optional) return undefined as any;

  if (typeof identity === 'string') {
    if (isValidObjectId(identity)) {
      return new Types.ObjectId(identity as string);
    }
    throw new IntegrityException('Use of invalid object id detected.');
  }

  if (identity instanceof Types.ObjectId) {
    // Somehow type guards are not working here...
    return identity as Types.ObjectId;
  }

  if (
    identity &&
    '_id' in identity &&
    (typeof identity['_id'] === 'string' || identity['_id'] instanceof Types.ObjectId)
  ) {
    return assureObjectId(identity['_id']);
  }

  if (identity && 'id' in identity && typeof identity['id'] === 'string') {
    return assureObjectId(identity['id']);
  }

  throw new IntegrityException('Use of invalid object id detected.');
}

export function applyUpdateTo<T extends BaseEntity<any>>(
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

export function applyInc<T>(model: T, incData: Record<string, number>) {
  Object.keys(incData).forEach((path) => {
    if (typeof incData[path] !== 'number') {
      return;
    }

    let modelToInc = model;
    let fieldToInc = path;

    if (path.includes('.') && path.lastIndexOf('.') !== path.length - 1) {
      fieldToInc = path.slice(path.lastIndexOf('.') + 1);
      modelToInc = findByPath(model, path, true);
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
      pushData[key] &&
      typeof pushData[key] === 'object' &&
      '$each' in pushData[key] &&
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

  if (obj instanceof Types.ObjectId) {
    return obj.toString();
  }

  if (obj._id) {
    return obj._id.toString();
  }

  if (!optional) return undefined as any;

  throw new IntegrityException('Use of invalid object id detected.');
}

export function createBaseEntityInstance<T>(constructor: Type<T>, data: DeepPartial<T>) {
  const model = Object.create(constructor.prototype);
  if (typeof model.init === 'function') {
    model.init(data);
  } else {
    assignEntityData(model, data);
  }
  return model;
}
