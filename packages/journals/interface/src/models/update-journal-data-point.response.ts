import { Expose } from 'class-transformer';
import { PropertyType } from '@lyvely/common';
import { UpdateDataPointResponse, DataPointModel } from '@/time-series';
import { JournalModel } from '@/journals';

@Expose()
export class UpdateJournalDataPointResponse extends UpdateDataPointResponse<UpdateJournalDataPointResponse> {
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;

  @PropertyType(JournalModel)
  model: JournalModel;
}
