import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps } from './util';
import { PropertiesOf } from '../utils/util.types';
import { hasOwnNonNullableProperty, isPlainObject } from '../utils';

interface IDocument<T> {
  _id?: any;
  id?: string;
  toJSON?: () => Partial<PropertiesOf<T>>;
}

export type IGetDefaults = {
  getDefaults: () => any;
};

export function implementsGetDefaults(model: any): model is IGetDefaults {
  return typeof (model as IGetDefaults).getDefaults === 'function';
}

export type IAfterInit = {
  afterInit: () => any;
};

export function implementsAfterInit(model: any): model is IAfterInit {
  return isPlainObject(model) && typeof (model as IAfterInit).afterInit === 'function';
}

export type IToJson = {
  toJSON: () => any;
};

export function implementsToJson(model: any): model is IToJson {
  return typeof (model as IToJson).toJSON === 'function';
}

export abstract class BaseModel<T> {
  constructor(obj?: Partial<PropertiesOf<T>>) {
    if (implementsGetDefaults(this)) {
      obj = obj ? Object.assign(this.getDefaults(), obj) : this.getDefaults();
    }

    assignRawDataToAndInitProps(this, obj);

    if (implementsAfterInit(this)) {
      this.afterInit();
    }
  }
}

export abstract class DocumentModel<T extends IDocument<T>> extends BaseModel<T> {
  @Expose()
  @Transform(({ value, obj }) => obj._id?.toString() || value)
  id: string;

  @Exclude()
  _id?: object | string;

  constructor(obj?: Partial<PropertiesOf<T>>) {
    if (!obj) {
      super();
      return;
    }

    if (implementsToJson(obj)) {
      obj = obj.toJSON();
    }

    if (hasOwnNonNullableProperty<DocumentModel<any>>(obj, '_id') && isPlainObject(obj._id)) {
      obj['id'] = (obj['_id'] as object).toString();
    }

    super(obj);
  }
}
