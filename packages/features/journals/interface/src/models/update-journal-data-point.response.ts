import { Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
import { UpdateDataPointResponse, DataPointModel } from '@lyvely/time-series-interface';
import { JournalModel } from './journal.model';

@Expose()
export class UpdateJournalDataPointResponse extends UpdateDataPointResponse {
  @PropertyType(DataPointModel)
  override dataPoint: DataPointModel;

  @PropertyType(JournalModel)
  override model: JournalModel;
}
