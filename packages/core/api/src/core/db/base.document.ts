import { Exclude, Expose } from 'class-transformer';
import { Document, TObjectId } from './db.type';
import { DeepPartial, assignRawDataToAndInitProps, implementsGetDefaults } from '@lyvely/common';

export type EntityType<C, ID = TObjectId> = C & IEntity<ID>;

export interface IEntity<ID = TObjectId> {
  _id: ID;
}

export abstract class BaseDocument<C, ID = TObjectId> implements IEntity<ID> {
  @Exclude()
  _id: ID;

  @Expose()
  id: string;

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

  if (instance instanceof BaseDocument && instance._id && !instance.id) {
    instance.id = instance._id.toString();
  }

  return instance;
}