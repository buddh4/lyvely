import { Expose, Type } from 'class-transformer';
import { TagModel } from '@lyvely/profiles-interface';
import { PropertyType } from '@lyvely/common';
import { ContentUpdateResponse } from '@lyvely/content-interface';
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
