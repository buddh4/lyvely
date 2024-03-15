import { initBaseModelData, implementsToJson } from './util';
import { PartialPropertiesOf, type PropertiesOf } from '../utils/util.types';
import { hasOwnNonNullableProperty } from '../utils/object.util';

interface InitOptions {
  strict?: boolean;
  skipGetDefaults?: boolean;
}

export type StrictBaseModelData<TModel extends object> = PropertiesOf<TModel> | TModel | false;

export type BaseModelData<TModel extends object> =
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
    return initBaseModelData(instance, data, options);
  },
};
