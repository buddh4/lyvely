import { Expose } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateJournalModel } from './create-journal.model';
import { BaseModel, type PropertiesOf } from '@lyvely/common';

@Expose()
export class UpdateJournalModel extends PartialType(CreateJournalModel) {
  constructor(data: PropertiesOf<UpdateJournalModel>) {
    super(false);
    BaseModel.init(this, data, { skipGetDefaults: true });
  }
}
