import { Exclude, Type, Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { HabitDto } from '../habit';
import { TaskDto } from '../task';
import { IActivityRangeResponse, ActivityType, IActivity } from '../interfaces';
import { BaseDto } from '../../model';
import { ITimeSeriesNumberDataPoint, NumberDataPointDto } from "../../time-series";

@Exclude()
export class ActivityRangeResponseDto extends BaseDto<ActivityRangeResponseDto> implements IActivityRangeResponse {

  @Expose()
  @IsArray()
  @Type(() => HabitDto)
  habits: HabitDto[] = [];

  @Expose()
  @IsArray()
  @Type(() => TaskDto)
  tasks: TaskDto[] = [];

  @Expose()
  @IsArray()
  @Type(() => NumberDataPointDto)
  dataPoints: NumberDataPointDto[] = [];

  addActivity(activity: IActivity) {
    switch (activity.type) {
      case ActivityType.Habit:
        this.habits.push(new HabitDto(activity));
        break;
      case ActivityType.Task:
        this.tasks.push(new TaskDto(activity));
        break;
    }
  }

  addActivities(activities: IActivity[]) {
    activities.forEach((activity) => this.addActivity(activity));
  }

  addDataPoint(activityLog: ITimeSeriesNumberDataPoint) {
    this.dataPoints.push(new NumberDataPointDto(activityLog));
  }

  addDataPoints(activityLogs: ITimeSeriesNumberDataPoint[]) {
    activityLogs.forEach((log) => this.addDataPoint(log));
  }
}
