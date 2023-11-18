import { Type, Expose } from 'class-transformer';
import { JournalModel } from './journal.model';
import { BaseModel, PropertyType } from '@lyvely/common';
import { DataPointModel, ITimeSeriesCalendarPlanResponse } from '@lyvely/time-series-interface';

@Expose()
export class JournalSearchResponse
  extends BaseModel<JournalSearchResponse>
  implements ITimeSeriesCalendarPlanResponse<JournalModel>
{
  @Expose()
  @PropertyType([JournalModel])
  models: JournalModel[];

  @Expose()
  dataPoints: DataPointModel[];
}
