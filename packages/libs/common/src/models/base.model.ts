import { assignRawDataToAndInitProps, implementsToJson } from './util';
import { PartialPropertiesOf, type PropertiesOf } from '../utils/util.types';
import { hasOwnNonNullableProperty } from '../utils/object.util';
import { implementsGetDefaults } from './util/model-interfaces.helper';

interface IDocument {
  _id?: any;
  id?: string;
}

interface InitOptions {
  strict?: boolean;
  skipGetDefaults?: boolean;
}

export type StrictBaseModelData<TModel extends Object> = PropertiesOf<TModel> | TModel | false;

export type BaseModelData<TModel extends Object> =
  | StrictBaseModelData<TModel>
  | PartialPropertiesOf<TModel>
  | Partial<TModel>
  | TModel
  | false;

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
export const BaseModel = {
  init<TModel extends Object = any>(
    instance: TModel,
    data?: BaseModelData<TModel>,
    options?: InitOptions,
  ) {
    if (data === false) return;
    if (implementsGetDefaults(instance) && !options?.skipGetDefaults) {
      data = data ? Object.assign(instance.getDefaults(), data) : instance.getDefaults();
    }

    assignRawDataToAndInitProps(instance, data, options);
  },
};

export const DocumentModel = {
  init<TModel extends Object = any>(
    instance: TModel,
    data?: BaseModelData<TModel>,
    options?: InitOptions,
  ) {
    if (!data) {
      return BaseModel.init(instance, data, options);
    }

    if (implementsToJson(data)) {
      data = data.toJSON();
    }

    if (hasOwnNonNullableProperty<IDocument>(data, '_id')) {
      data['id'] = (data['_id'] as object).toString();
    }

    BaseModel.init(instance, data, options);
  },
};
