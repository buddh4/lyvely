import { User } from '@lyvely/users';
import { Profile } from '@lyvely/profiles';
import { CalendarDate } from '@lyvely/dates';
import { isTimerDataPointConfig } from '@lyvely/time-series-interface';
import { EntityNotFoundException, IntegrityException } from '@lyvely/common';
import { DataPointService } from './data-point.service';
import { DataPoint, TimerDataPoint, TimeSeriesContent } from '../schemas';

export abstract class TimerDataPointService<
  T extends TimeSeriesContent<T> = TimeSeriesContent<any>,
> {
  abstract dataPointService: DataPointService<T>;

  async startTimer(
    profile: Profile,
    user: User,
    model: T,
    date: CalendarDate,
  ): Promise<TimerDataPoint> {
    if (!isTimerDataPointConfig(model.timeSeriesConfig))
      throw new IntegrityException('Can not start timer of non timer time series.');

    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      profile,
      user,
      model,
      date,
    );

    if (!this.isTimerDataPoint(dataPoint))
      throw new IntegrityException('Can not start timer of non timer data point.');

    if (dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.startTimer(user);

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      model,
      date,
      dataPoint.value,
    );

    return updatedDataPoint as TimerDataPoint;
  }

  async stopTimer(
    profile: Profile,
    user: User,
    model: T,
    date: CalendarDate,
  ): Promise<TimerDataPoint> {
    if (!isTimerDataPointConfig(model.timeSeriesConfig))
      throw new IntegrityException('Can not start timer of non timer time series.');

    const { dataPoint } = await this.dataPointService.findOrCreateDataPointByDate(
      profile,
      user,
      model,
      date,
    );

    if (!this.isTimerDataPoint(dataPoint))
      throw new IntegrityException('Can not stop timer of non timer data point.');

    if (!dataPoint.isTimerStarted()) return dataPoint;

    dataPoint.stopTimer();

    const { dataPoint: updatedDataPoint } = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      model,
      date,
      dataPoint.value,
    );

    return updatedDataPoint as TimerDataPoint;
  }

  private isTimerDataPoint(dataPoint: DataPoint): dataPoint is TimerDataPoint {
    if (!dataPoint) throw new EntityNotFoundException();
    if (!(dataPoint instanceof TimerDataPoint))
      throw new IntegrityException('Can not start timer of non timer data point.');

    return true;
  }
}
