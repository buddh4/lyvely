import { Exclude, Expose } from 'class-transformer';
import mongoose  from 'mongoose';
import { DeepPartial } from 'lyvely-common';
import { assureStringId } from "./db.utils";

export type EntityType<C, ID = mongoose.Types.ObjectId> = C & IEntity<ID>;

interface IEntity<ID = mongoose.Types.ObjectId> {
  _id: ID;
}

export abstract class BaseEntity<C extends IEntity<ID> = IEntity<any>, ID = mongoose.Types.ObjectId> implements IEntity<ID> {

  constructor(obj?: DeepPartial<C>) {
    assignEntityData(this, obj);
    this.afterInit();
  }

  afterInit() {/* Nothing todo */}

  @Exclude()
  public _id: ID;

  @Expose()
  public id: string;
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
}
