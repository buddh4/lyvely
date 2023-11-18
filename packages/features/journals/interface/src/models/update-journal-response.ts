import { Expose } from 'class-transformer';
import { TagModel, ContentUpdateResponse } from '@lyvely/core-interface';
import { PropertyType } from '@lyvely/common';
import { JournalModel } from './journal.model';

export class UpdateJournalResponse extends ContentUpdateResponse<JournalModel> {
  @Expose()
  @PropertyType(JournalModel)
  model: JournalModel;

  @Expose()
  @PropertyType([TagModel])
  tags: TagModel[];
}
