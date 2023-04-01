import { Type, Expose } from 'class-transformer';
import { JournalModel } from './journal.model';
import { BaseModel, PropertyType } from '@/models';
import { DataPointModel } from '@/time-series';
import { ICalendarPlanResponse } from '@/calendar-plan';

@Expose()
export class JournalSearchResponse
  extends BaseModel<JournalSearchResponse>
  implements ICalendarPlanResponse<JournalModel>
{
  @Expose()
  @Type(() => JournalModel)
  @PropertyType([JournalModel])
  models: JournalModel[];

  @Expose()
  dataPoints: DataPointModel[];
}
