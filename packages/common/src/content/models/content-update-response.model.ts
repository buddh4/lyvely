import { Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { IContent } from '../interfaces';

@Expose()
export abstract class ContentUpdateResponse<TModel extends IContent> {
  abstract model: TModel;

  @Type(() => TagModel)
  tags: TagModel[];
}
