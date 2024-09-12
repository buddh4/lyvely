import { Exclude, Expose } from 'class-transformer';
import { StreamRequest } from '@/streams';
import { ContentRequestFilter } from './content-request.filter';
import { PropertyType } from '@lyvely/common';

@Exclude()
export class ContentStreamRequestModel extends StreamRequest<ContentRequestFilter> {
  @Expose()
  @PropertyType(ContentRequestFilter)
  override filter?: ContentRequestFilter;
}
