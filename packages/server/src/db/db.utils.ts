import { Document, Types } from 'mongoose';
import { InternalServerErrorException } from '@nestjs/common';
import { BaseEntity } from './base.entity';
import { isValidObjectId } from 'lyvely-common';

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
