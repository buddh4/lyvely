import { User } from '@/users';
import { Profile } from '@/profiles';
import { TimerDataPoint } from '../schemas';
import { TimerDataPointContent } from '../interfaces';
import { CalendarDate } from '@lyvely/common';
import { DataPointService } from './data-point.service';

export abstract class TimerDataPointService<
  TModel extends TimerDataPointContent = TimerDataPointContent,
  DataPointModel extends TimerDataPoint = TimerDataPoint,
> {
  abstract dataPointService: DataPointService<TModel, DataPointModel>;

  async startTimer(profile: Profile, user: User, model: TModel, date: CalendarDate) {
    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      profile,
      user,
      model,
      date,
    );

    if (dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.startTimer(user);

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      model,
      date,
      dataPoint.value,
    );
    return updatedDataPoint;
  }

  async stopTimer(profile: Profile, user: User, model: TModel, date: CalendarDate) {
    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      profile,
      user,
      model,
      date,
    );

    if (!dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.stopTimer();

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      model,
      date,
      dataPoint.value,
    );

    return updatedDataPoint;
  }
}
