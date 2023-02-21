import { Exclude, Type, Expose } from 'class-transformer';
import { HabitModel } from '../habits';
import { TaskModel } from '../tasks';
import { ActivityType, ActivityModel } from '../models';
import { BaseModel, PropertyType } from '@/models';
import { NumberDataPointModel } from '@/time-series';
import { ICalendarPlanResponse } from '@/calendar-plan';

@Exclude()
export class ActivitySearchResponse
  extends BaseModel<ActivitySearchResponse>
  implements ICalendarPlanResponse<ActivityModel, NumberDataPointModel>
{
  @Expose()
  @Type(() => ActivityModel, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: HabitModel, name: ActivityType.Habit },
        { value: TaskModel, name: ActivityType.Task },
      ],
    },
  })
  models: ActivityModel[];

  @Expose()
  @Type(() => NumberDataPointModel)
  dataPoints: NumberDataPointModel[];
}
