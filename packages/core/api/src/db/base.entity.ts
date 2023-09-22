import { Exclude, Expose } from 'class-transformer';
import { Document, Types } from 'mongoose';
import { DeepPartial } from '@lyvely/core-common';
import { assignRawDataToAndInitProps, implementsGetDefaults } from '@lyvely/models';

export type TObjectId = Types.ObjectId;

export type EntityType<C, ID = TObjectId> = C & IEntity<ID>;

export interface IEntity<ID = TObjectId> {
  _id: ID;
}

export type DocumentType<T> = T & Document;

export abstract class BaseEntity<C, ID = TObjectId> implements IEntity<ID> {
  constructor(obj?: DeepPartial<C> | false) {
    if (obj !== false) {
      this.init(obj);
    }
  }

  init(obj?: DeepPartial<C> | false) {
    if (implementsGetDefaults(this)) {
      const defaultValues = this.getDefaults();
      if (defaultValues) {
        obj = Object.assign(defaultValues, obj);
      }
    }

    assignEntityData(this, obj);
    this.afterInit();
  }

  afterInit() {
    /* Nothing todo */
  }

  @Exclude()
  _id: ID;

  @Expose()
  id: string;
}

// Note: We do not use db.utils.ts to prevent circular dependency...
export function assignEntityData<T extends Record<string, any>, U>(instance: T, obj?: U) {
  if (obj) {
    if (obj instanceof Document) {
      assignRawDataToAndInitProps(instance, obj.toObject());
    } else {
      assignRawDataToAndInitProps(instance, obj);
    }
  } else {
    assignRawDataToAndInitProps(instance);
  }

  if (instance instanceof BaseEntity && instance._id && !instance.id) {
    instance.id = instance._id.toString();
  }

  return instance;
}
