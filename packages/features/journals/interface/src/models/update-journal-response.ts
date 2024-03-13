import { Expose } from 'class-transformer';
import { ContentUpdateResponse } from '@lyvely/interface';
import { PropertyType } from '@lyvely/common';
import { JournalModel } from './journal.model';

export class UpdateJournalResponse extends ContentUpdateResponse<JournalModel> {
  @Expose()
  @PropertyType(JournalModel)
  model: JournalModel;
}
