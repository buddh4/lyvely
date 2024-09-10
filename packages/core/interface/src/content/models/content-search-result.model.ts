import { Exclude, Expose } from 'class-transformer';
import { ContentModel } from './content.model';
import { BaseModel, type BaseModelData } from '@lyvely/common';

@Exclude()
export class ContentSearchResult {
  @Expose()
  result: ContentModel[];

  constructor(data?: BaseModelData<ContentSearchResult>) {
    BaseModel.init(this, data);
  }
}
