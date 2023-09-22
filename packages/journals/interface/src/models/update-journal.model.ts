import { Expose } from 'class-transformer';
import { PartialType } from '@buddh4/mapped-types';
import { CreateJournalModel } from './create-journal.model';

@Expose()
export class UpdateJournalModel extends PartialType(CreateJournalModel) {
  constructor(model?: Partial<UpdateJournalModel>) {
    super(model, false);
  }
}
