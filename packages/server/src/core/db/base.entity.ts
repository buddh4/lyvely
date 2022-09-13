import { Exclude, Expose } from 'class-transformer';
import { Document } from 'mongoose';
import { DeepPartial } from '@lyvely/common';

export type EntityType<C, ID = TObjectId> = C & IEntity<ID>;

export interface IEntity<ID = TObjectId> {
  _id: ID;
}

export abstract class BaseEntity<C, ID = TObjectId> implements IEntity<ID> {

  constructor(obj?: DeepPartial<C> | false) {
    if(obj !== false) {
      this.init(obj);
    }
  }

  init(obj?: DeepPartial<C> | false) {
    assignEntityData(this, obj);
    this.afterInit();
  }

  afterInit() {/* Nothing todo */}

  @Exclude()
  public _id: ID;

  @Expose()
  public id: string;
}

// Note: We do not use db.utils.ts to prevent circular dependency...
export function assignEntityData<T extends Record<string, any>, U>(instance: T, obj?: U) {
  if(obj) {
    if(obj instanceof Document) {
      Object.assign(instance, obj.toObject());
    } else {
      Object.assign(instance, obj);
    }
  }

  if(instance instanceof BaseEntity && instance._id && !instance.id) {
    instance.id = instance._id.toString();
  }

  return instance;
}
