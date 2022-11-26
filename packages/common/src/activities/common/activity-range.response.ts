import { Exclude, Type, Expose } from 'class-transformer';
import { HabitModel } from '../habits';
import { TaskModel } from '../tasks';
import { ActivityType, ActivityModel } from '../models';
import { BaseModel } from '@/models';
import { NumberDataPointModel } from '@/time-series';
import { PropertiesOf } from '@/utils';

@Exclude()
export class ActivityRangeResponse extends BaseModel<ActivityRangeResponse> {
  @Expose()
  @Type(() => HabitModel)
  habits: HabitModel[] = [];

  @Expose()
  @Type(() => TaskModel)
  tasks: TaskModel[] = [];

  @Expose()
  @Type(() => NumberDataPointModel)
  dataPoints: NumberDataPointModel[] = [];

  addActivity(activity: PropertiesOf<ActivityModel>) {
    switch (activity.type) {
      case ActivityType.Habit:
        this.habits.push(activity instanceof HabitModel ? activity : new HabitModel(activity));
        break;
      case ActivityType.Task:
        this.tasks.push(activity instanceof TaskModel ? activity : new TaskModel(activity));
        break;
    }
  }

  addActivities(activities: PropertiesOf<ActivityModel>[]) {
    activities.forEach((activity) => this.addActivity(activity));
  }

  addDataPoint(activityLog: NumberDataPointModel) {
    this.dataPoints.push(new NumberDataPointModel(activityLog));
  }

  addDataPoints(activityLogs: NumberDataPointModel[]) {
    activityLogs.forEach((log) => this.addDataPoint(log));
  }
}
