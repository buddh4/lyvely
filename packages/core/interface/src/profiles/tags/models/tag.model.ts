import { DocumentModel } from '@lyvely/common';
import { Expose, Exclude } from 'class-transformer';
import randomColor from 'randomcolor';

@Exclude()
export class TagModel {
  @Expose()
  id: string;

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

  constructor(data?: Partial<TagModel>) {
    DocumentModel.init(this, data);
    this.color ||= randomColor({ luminosity: 'dark' });
  }
}
