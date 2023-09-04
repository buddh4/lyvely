import { Expose, Type } from 'class-transformer';
import { TagModel } from '@/tags';
import { PropertyType } from '@/models';
import { ContentUpdateResponse } from '@lyvely/content';
import { JournalModel } from './journal.model';

export class UpdateJournalResponse extends ContentUpdateResponse<JournalModel> {
  @Expose()
  @Type(() => JournalModel)
  @PropertyType(JournalModel)
  model: JournalModel;

  @Expose()
  @Type(() => TagModel)
  @PropertyType([TagModel])
  tags: TagModel[];
}
