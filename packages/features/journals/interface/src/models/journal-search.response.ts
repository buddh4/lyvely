import { Expose } from 'class-transformer';
import { JournalModel } from './journal.model';
import { BaseModel, type PropertiesOf, PropertyType } from '@lyvely/common';
import { DataPointModel, ITimeSeriesCalendarPlanResponse } from '@lyvely/time-series-interface';

@Expose()
export class JournalSearchResponse implements ITimeSeriesCalendarPlanResponse<JournalModel> {
  @Expose()
  @PropertyType([JournalModel])
  models: JournalModel[];

  @Expose()
  dataPoints: DataPointModel[];

  constructor(data: PropertiesOf<JournalSearchResponse>) {
    BaseModel.init(this, data);
  }
}
