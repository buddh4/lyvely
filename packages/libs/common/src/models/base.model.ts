import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps, implementsAfterInit, implementsToJson } from './util';
import { PropertiesOf } from '../utils/util.types';
import { hasOwnNonNullableProperty, isPlainObject } from '../utils/object.util';
import { implementsGetDefaults } from './util/model-interfaces.helper';

interface IDocument<T> {
  _id?: any;
  id?: string;
  toJSON?: () => Partial<PropertiesOf<T>>;
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
