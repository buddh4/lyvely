import { Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
import { UpdateDataPointResponse, DataPointModel } from '@lyvely/time-series-interface';
import { JournalModel } from './journal.model';

@Expose()
export class UpdateJournalDataPointResponse extends UpdateDataPointResponse<UpdateJournalDataPointResponse> {
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;

  @PropertyType(JournalModel)
  model: JournalModel;
}
