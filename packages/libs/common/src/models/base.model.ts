import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps, implementsAfterInit, implementsToJson } from './util';
import { PartialPropertiesOf, PropertiesOf } from '../utils/util.types';
import { hasOwnNonNullableProperty, isPlainObject } from '../utils/object.util';
import { implementsGetDefaults } from './util/model-interfaces.helper';

interface IDocument<T> {
  _id?: any;
  id?: string;
  toJSON?: () => Partial<PropertiesOf<T>>;
}

interface InitOptions {
  strict?: boolean;
}

/**
 * Base Model utility for creating models with common behaviors.
 * Usage:
 *
 * class MyModel extends SomeModel {
 *   test: string;
 *
 *   constructor(data?: PartialPropertiesOf<MyModel>) {
 *     super();
 *     Model.init(this, data);
 *   }
 *
 *   getDefaults(): PartialPropertiesOf<MyModel> {
 *     return {
 *       test: 'test';
 *     }
 *   }
 * }
 *
 * Note, any super constructor call needs to be called prior to the init call.
 * @abstract
 * @class
 * @template T - The type of the model.
 */
export const Model = {
  init<TModel extends Object = any>(
    instance: TModel,
    data?: PartialPropertiesOf<TModel>,
    options?: InitOptions,
  ) {
    if (implementsGetDefaults(instance)) {
      data = data ? Object.assign(instance.getDefaults(), data) : instance.getDefaults();
    }

    if (data) {
      assignRawDataToAndInitProps(instance, data, options);
    }
  },
};

export const Document = {
  init<TModel extends Object = any>(
    instance: TModel,
    data?: PartialPropertiesOf<TModel>,
    options?: InitOptions,
  ) {
    if (!data) {
      return Model.init(instance, data, options);
    }

    if (implementsToJson(data)) {
      data = data.toJSON();
    }

    if (hasOwnNonNullableProperty<DocumentModel<any>>(data, '_id') && isPlainObject(data._id)) {
      data['id'] = (data['_id'] as object).toString();
    }

    Model.init(instance, data, options);
  },
};

/**
 * @deprecated Due to es2020 class field incompatibility, use Model.init() utility instead.
 */
export abstract class BaseModel<T> {
  constructor(data?: PartialPropertiesOf<T> | false) {
    if (data !== false) {
      Model.init<BaseModel<T>>(this, data);
    }

    // Note, the afterInit call is deprecated, we should either use field initializers, getDefaults or the constructor itself
    if (data !== false && implementsAfterInit(this)) {
      this.afterInit();
    }
  }
}

/**
 * @deprecated Due to es2020 class field incompatibility, use Document.init() utility instead.
 */
export abstract class DocumentModel<T extends IDocument<T>> extends BaseModel<T> {
  @Expose()
  @Transform(({ value, obj }) => obj._id?.toString() || value)
  id: string;

  @Exclude()
  _id?: object | string;

  constructor(data?: PartialPropertiesOf<T> | false) {
    if (typeof data === undefined) {
      super();
    } else if (data === false) {
      super(false);
    } else {
      super(false);
      Document.init<DocumentModel<T>>(this, data);
      if (implementsAfterInit(this)) {
        this.afterInit();
      }
    }
  }
}
