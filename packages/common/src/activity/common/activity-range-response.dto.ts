import { Exclude, Type } from 'class-transformer';
import { IsArray } from 'class-validator';
import { HabitDto } from '../habit';
import { TaskDto } from '../task';
import { IActivityRangeResponse, ActivityType, IActivity, IActivityDataPoint } from '../interfaces';
import { ActivityDataPointDto } from '../models';
import { BaseDto } from '../../model';

@Exclude()
export class ActivityRangeResponseDto extends BaseDto<ActivityRangeResponseDto> implements IActivityRangeResponse {

  @IsArray()
  @Type(() => HabitDto)
  habits: HabitDto[] = [];

  @IsArray()
  @Type(() => TaskDto)
  tasks: TaskDto[] = [];

  @IsArray()
  @Type(() => ActivityDataPointDto)
  dataPoints: ActivityDataPointDto[] = [];

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

  addActivityLog(activityLog: IActivityDataPoint) {
    this.dataPoints.push(new ActivityDataPointDto(activityLog));
  }

  addActivityLogs(activityLogs: IActivityDataPoint[]) {
    activityLogs.forEach((log) => this.addActivityLog(log));
  }
}