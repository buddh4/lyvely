import { Document, Types, UpdateQuery } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { isValidObjectId, assignRawDataTo, DeepPartial, Type } from '@lyvely/common';

export type EntityIdentity<T extends BaseEntity<any>> = T | Types.ObjectId | string | Document & T;

export type EntityData<T> = Omit<T, '_id' | 'id' | '__v'>;

// We use any here since we need to use this when defining sub documents
export function assureObjectId<T extends BaseEntity<any> = BaseEntity<any>>(identity: EntityIdentity<T>): Types.ObjectId {
  if (typeof identity === 'string') {
    if(isValidObjectId(identity)) {
      return new Types.ObjectId(identity as string);
    }
    throw new InternalServerErrorException('Use of invalid object id detected.');
  }

  if (identity instanceof Types.ObjectId) { // Somehow type guards are not working here...
    return identity as Types.ObjectId;
  }

  if (identity && '_id' in identity && (typeof identity['_id'] === 'string' || identity['_id'] instanceof Types.ObjectId)) {
    return assureObjectId(identity['_id']);
  }

  if (identity && 'id' in identity && (typeof identity['id'] === 'string')) {
    return assureObjectId(identity['id']);
  }

  throw new InternalServerErrorException('Use of invalid object id detected.');
}

export function applyUpdateTo<T extends BaseEntity<any>>(identity: EntityIdentity<T>, update: UpdateQuery<T>) {
  if(typeof identity !== 'object') {
    return;
  }

  if('$inc' in update) {
    applyInc(identity, update['$inc']);
  }

  if('$set' in update) {
    applyRawDataTo(identity, update['$set']);
  }

  if('$push' in update) {
    applyPush(identity, update['$push']);
  }
}

export function applyInc<T>(model: T, incData: Record<string, number>) {
  Object.keys(incData).forEach(path => {
    if(typeof incData[path] !== 'number') {
      return;
    }

    let modelToInc = model;
    let fieldToInc = path;

    if(path.includes('.') && path.lastIndexOf('.') !== path.length - 1) {
      fieldToInc = path.slice(path.lastIndexOf(".") + 1);
      modelToInc = findByPath(model, path, true);
    }

    if(modelToInc && typeof modelToInc[fieldToInc] === 'number') {
      modelToInc[fieldToInc] += incData[path]
    }
  });
}

export function findByPath<T>(model: T, path: string, parent = false) {
  if(!path.includes('.')) {
    return parent ? model : model[path];
  }

  path = parent ? path.replace(/\.[^/.]+$/, "") : path;

  let result = model;
  path.split('.').forEach(sub => result = result || result[sub] ? result[sub] : undefined);
  return result;
}

export function applyPush<T>(model: T, pushData: { [ key in keyof T ]?: any }): T {
  // TODO: support path
  Object.keys(pushData).forEach(key => {
    if(typeof model[key] === 'undefined') {
      model[key] = [];
    }

    if(typeof pushData[key] === 'object' && '$each' in pushData[key] && Array.isArray(pushData[key][`$each`])) {
      model[key] = [...model[key], ...pushData[key][`$each`]];
    } else {
      model[key].push(pushData[key]);
    }
    // TODO: support $sort and $slice
  });

  return model;
}

export function applyRawDataTo<T>(model: T, data: { [ key in keyof T ]?: any }, { maxDepth = 100, strict = false } = {}): T {
  return assignRawDataTo(model, data, { maxDepth, strict });
}

export function assureStringId(obj: any): string {
  if (!obj) {
    console.trace('assureStringId called on undefined object');
    return;
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

  throw new InternalServerErrorException('Use of invalid object id detected.');
}

// Todo: Proper typing...
export function assignEntityData<T extends Record<string, any>, U>(instance: T, obj?: U) {
  if(obj) {
    if(obj instanceof Document) {
      Object.assign(instance, obj.toObject());
    } else {
      Object.assign(instance, obj);
    }
  }

  if(instance instanceof BaseEntity && instance._id && !instance.id) {
    instance.id = assureStringId(instance._id);
  }

  return instance;
}

export function createBaseEntityInstance<T>(constructor: Type<T>, data: DeepPartial<T>) {
  const model = Object.create(constructor.prototype);
  if(typeof model.init === 'function') {
    model.init(data);
  } else {
    assignEntityData(model, data);
  }
  return model;
}
