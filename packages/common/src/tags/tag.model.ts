import { DocumentDto } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { ITag } from './tag.interface';

@Exclude()
export class TagDto extends DocumentDto<TagDto> implements ITag {
  @Expose()
  name: string;
}
