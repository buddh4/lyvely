import { DocumentModel } from '../model';
import { Expose, Exclude } from 'class-transformer';
import { ITag } from './tag.interface';
import randomColor from "randomcolor";

@Exclude()
export class TagDto extends DocumentModel<TagDto> implements ITag {
  @Expose()
  name: string;

  @Expose()
  color: string;

  @Expose()
  description?: string;

  @Expose()
  archived?: boolean;

  @Expose()
  includeOnFilter?: boolean;

  constructor(obj?: Partial<TagDto>) {
    super(obj);
    this.color = this.color || randomColor({ luminosity: 'dark' })
  }
}
