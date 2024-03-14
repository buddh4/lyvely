import { Exclude, Expose } from 'class-transformer';
import { Document, TObjectId } from './db.type';
import {
  assignRawDataToAndInitProps,
  implementsGetDefaults,
  implementsAfterInit,
} from '@lyvely/common';
import { PartialPropertiesOf, type PropertiesOf } from '@lyvely/common';

export interface IEntity<ID = TObjectId> {
  _id: ID;
}

interface InitOptions {
  strict?: boolean;
  skipGetDefaults?: boolean;
  skipAfterInit?: boolean;
}

export type NonPersistedDocument<TModel extends BaseDocument> = Omit<
  TModel,
  'id' | '_id' | 'createdAt' | 'updatedAt'
>;

export type StrictBaseDocumentData<TModel extends BaseDocument> =
  | PropertiesOf<NonPersistedDocument<TModel>>
  | false;

export type BaseDocumentData<TModel extends BaseDocument> =
  | StrictBaseDocumentData<TModel>
  | PartialPropertiesOf<TModel>
  | Partial<TModel>
  | TModel
  | false;

export abstract class BaseDocument<ID = TObjectId> implements IEntity<ID> {
  @Exclude()
  _id: ID;

  @Expose()
  id: string;

  /**
   * Initializes an instance of a document with provided data and options.
   * This is initializer is usually called within a constructor.
   * In case ca subclass adds additional fields, which need to be respected. It should call its super constructor
   * with a `false` data value. This will skip the initializer steps and leave it to the subclass to call it.
   * This is required, since ES2020 super constructor can not set fields of a subclass, since they will be overwritten.
   *
   * Example:
   *
   * class MyDocument extends BaseDocument {
   *   fieldA: string;
   *
   *   constructor(data: StrictBaseModelData) {
   *     BaseDocument.init(this, data);
   *   }
   * }
   *
   * class MySubDocument extends MyDocument {
   *   fieldB: string;
   *
   *   constructor(data: StrictBaseModelData) {
   *     // This is required in order to support ES2020 class fields.
   *     super(false);
   *     BaseDocument.init(this, data);
   *   }
   * }
   *
   * @template T - The type of the class instance.
   * @param {T} instance - The instance to initialize.
   * @param {BaseModelData<T>} data - The data to initialize the instance with.
   * @param {InitOptions} options - The options for initialization.
   * @returns {void}
   */
  static init<T extends BaseDocument>(
    instance: T,
    data?: BaseDocumentData<T>,
    options?: InitOptions,
  ) {
    if (data === false) return;
    if (implementsGetDefaults(instance) && !options?.skipGetDefaults) {
      const defaultValues = instance.getDefaults();
      if (defaultValues) {
        data = Object.assign(defaultValues, data);
      }
    }

    assignEntityData(instance, data);

    if (implementsAfterInit(instance) && !options?.skipAfterInit) {
      instance.afterInit();
    }
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

  if (instance._id && !instance.id) {
    (<any>instance).id = instance._id.toString();
  }

  return instance;
}
