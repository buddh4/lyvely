import { Exclude, Expose } from 'class-transformer';
import mongoose  from 'mongoose';
import { DeepPartial } from 'lyvely-common';
import { assureStringId } from "./db.utils";

type Constructor<T> = new (...args: any[]) => T;

export type EntityType<C, ID = mongoose.Types.ObjectId> = C & IEntity<ID>;

interface IEntity<ID = mongoose.Types.ObjectId> {
  _id: ID;
}

export abstract class BaseEntity<C extends IEntity<ID> = IEntity<any>, ID = mongoose.Types.ObjectId> implements IEntity<ID> {

  constructor(obj?: DeepPartial<C> | false) {
    if(obj !== false) {
      this.init(obj);
    }
  }

  init(obj?: DeepPartial<C> | false) {
    assignEntityData(this, obj);
    this.afterInit();
  }

  protected afterInit() {/* Nothing todo */}

  @Exclude()
  public _id: ID;

  @Expose()
  public id: string;
}

export function createBaseEntityInstance<T extends BaseEntity>(constructor: Constructor<T>, data: DeepPartial<T>) {
  const model = Object.create(constructor.prototype);
  if(typeof model.init === 'function') {
    model.init(data);
  } else {
    assignEntityData(model, data);
  }
  return model;
}

// Todo: Proper typing...
export function assignEntityData<T extends Record<string, any>, U>(instance: T, obj?: U) {
  if(obj) {
    if(obj instanceof mongoose.Document) {
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
