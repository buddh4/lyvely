import { Transform, Expose, Exclude } from 'class-transformer';
import { assignRawDataToAndInitProps } from './util';
import { PropertiesOf } from '@lyvely/core';

export type DocumentMock<T> = {
  _id?: any;
  id?: string;
  toJSON?: () => T;
};

export abstract class BaseModel<T> {
  constructor(obj?: Partial<PropertiesOf<T>>) {
    if ('getDefaults' in this && typeof this.getDefaults === 'function') {
      obj = obj ? Object.assign(this.getDefaults(), obj) : this.getDefaults();
    }

    assignRawDataToAndInitProps(this, obj);

    if ('afterInit' in this && typeof this.afterInit === 'function') {
      this.afterInit();
    }
  }
}

export abstract class DocumentModel<T extends DocumentMock<T>> extends BaseModel<T> {
  @Expose()
  @Transform(({ value, obj }) => obj._id?.toString() || value)
  id: string;

  @Exclude()
  _id?: TObjectId;

  constructor(obj?: Partial<PropertiesOf<T>>) {
    if (!obj) {
      super();
      return;
    }

    if (obj && 'toJSON' in obj && typeof obj.toJSON === 'function') {
      obj = obj.toJSON();
    }

    if ('_id' in obj && typeof obj['_id'] === 'object') {
      obj['id'] = obj['_id'].toString();
    }

    super(obj);
  }
}
