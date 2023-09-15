import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps } from './util';
import { PropertiesOf } from '../utils/util.types';

export type DocumentMock<T> = {
  _id?: any;
  id?: string;
  toJSON?: () => Partial<PropertiesOf<T>>;
};

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
  return typeof (model as IAfterInit).afterInit === 'function';
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

export abstract class DocumentModel<T extends DocumentMock<T>> extends BaseModel<T> {
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

    if (obj && 'toJSON' in obj && typeof obj.toJSON === 'function') {
      obj = obj.toJSON();
    }

    if ('_id' in obj && typeof obj['_id'] === 'object') {
      obj['id'] = (obj['_id'] as object).toString();
    }

    super(obj);
  }
}
