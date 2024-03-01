import { Expose } from 'class-transformer';
import { TagModel } from '@/profiles';
import { IContent } from '../interfaces';
import { PropertyType } from '@lyvely/common';

@Expose()
export abstract class ContentUpdateResponse<TModel extends IContent> {
  abstract model: TModel;

  @Expose()
  @PropertyType([TagModel])
  tags: TagModel[];
}
