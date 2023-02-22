import { Exclude, Type, Expose } from 'class-transformer';
import { JournalModel } from '../models';
import { BaseModel } from '@/models';
import {
  DataPointModel,
  DataPointValueType,
  NumberDataPointModel,
  TextDataPointModel,
} from '@/time-series';
import { ICalendarPlanResponse } from '@/calendar-plan';

@Exclude()
export class JournalSearchResponse
  extends BaseModel<JournalSearchResponse>
  implements ICalendarPlanResponse<JournalModel>
{
  @Expose()
  @Type(() => JournalModel)
  models: JournalModel[];

  @Expose()
  @Type(() => DataPointModel, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'valueType',
      subTypes: [
        { value: NumberDataPointModel, name: DataPointValueType.Number },
        { value: TextDataPointModel, name: DataPointValueType.Text },
      ],
    },
  })
  dataPoints: DataPointModel[];
}
