import type { IContentInfo, IContentInfoResult } from '../interfaces';
import { Exclude, Expose } from 'class-transformer';
import { type StrictBaseModelData, TransformObjectId } from '@lyvely/common';
import { BaseModel, PropertyType } from '@lyvely/common';

/**
 * Represents basic information about a content entry.
 *
 * @class
 * @implements {IContentInfo}
 */
@Exclude()
export class ContentInfoModel<TID = string> implements IContentInfo<TID> {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  title: string;

  @Expose()
  text?: string;

  @Expose()
  @TransformObjectId()
  createdBy: TID;

  constructor(data?: StrictBaseModelData<IContentInfo<any>>) {
    BaseModel.init(this, data);
  }
}

@Exclude()
export class ContentInfoResultModel<TID = string> implements IContentInfoResult<TID> {
  @Expose()
  @PropertyType(ContentInfoModel)
  infos: IContentInfo<TID>[];

  constructor(data?: StrictBaseModelData<IContentInfoResult<any>>) {
    BaseModel.init(this, data);
  }
}
