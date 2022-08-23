import { DocumentDto } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { ITag } from './tag.interface';
import randomColor from "randomcolor";

@Exclude()
export class TagDto extends DocumentDto<TagDto> implements ITag {
  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  description?: string;

  @Expose()
  archived?: boolean;

  constructor(obj?: Partial<TagDto>) {
    super(obj);
    this.color = this.color || randomColor({ luminosity: 'dark' })
  }
}
