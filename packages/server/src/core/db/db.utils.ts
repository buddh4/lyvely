import { Document, Types, UpdateQuery } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { isValidObjectId, assignRawDataTo } from '@lyvely/common';
import { isObjectId } from "@lyvely/common";

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

  if('$set' in update) {
    applyRawDataTo(identity, update['$set']);
  }

  if('$push' in update) {
    applyPush(identity, update['$push']);
  }
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

type ApplyOptions = { maxDepth?: number, strict?: boolean }

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
