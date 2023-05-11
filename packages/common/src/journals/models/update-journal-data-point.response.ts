import { Expose } from 'class-transformer';
import { PropertyType } from '@/models';
import { UpdateDataPointResponse, DataPointModel } from '@/time-series';
import { JournalModel } from '@/journals';

@Expose()
export class UpdateJournalDataPointResponse extends UpdateDataPointResponse<UpdateJournalDataPointResponse> {
  @PropertyType(DataPointModel)
  dataPoint: DataPointModel;

  @PropertyType(JournalModel)
  model: JournalModel;
}
