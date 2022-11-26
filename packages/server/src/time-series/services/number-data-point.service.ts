import { User } from '@/users';
import { Profile } from '@/profiles';
import { DataPointService } from './data-point.service';
import { NumberDataPoint, NumberTimeSeriesContent } from '../schemas';
import { CalendarDate, DataPointInputType } from '@lyvely/common';
import { isDefined } from 'class-validator';

export abstract class NumberDataPointService<
  TimeSeriesModel extends NumberTimeSeriesContent,
  DataPointModel extends NumberDataPoint,
> extends DataPointService<TimeSeriesModel, DataPointModel, number> {
  protected async updateDataPointValue(
    profile: Profile,
    user: User,
    dataPoint: DataPointModel,
    model: TimeSeriesModel,
    newValue: number,
  ) {
    if (dataPoint.value === newValue) return;

    newValue = isDefined(model.timeSeriesConfig.max) ? Math.min(newValue, model.timeSeriesConfig.max) : newValue;
    await this.dataPointDao.updateDataPointValue(user, dataPoint, newValue);
  }

  async upsertDataPoint(
    profile: Profile,
    user: User,
    model: TimeSeriesModel,
    date: CalendarDate,
    value: number,
  ): Promise<DataPointModel> {
    if (isDefined(model.timeSeriesConfig.max)) {
      value = Math.min(model.timeSeriesConfig.max, value);
    }

    const dataPoint = await super.upsertDataPoint(profile, user, model, date, value);

    if (
      model.timeSeriesConfig.inputType === DataPointInputType.Time &&
      dataPoint.timer.calculateTotalSpan() !== value
    ) {
      dataPoint.timer.overwrite(value, user);
      await this.dataPointDao.updateOneSetById(dataPoint, { timer: dataPoint.timer });
    }

    return dataPoint;
  }

  async startTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);

    const timer = dataPoint.getTimer();

    if (!timer.isStarted()) {
      timer.start(user);
      await this.dataPointDao.updateOneSetById(dataPoint, { timer });
    }

    return dataPoint;
  }

  async stopTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);
    const timer = dataPoint.getTimer();

    if (!timer.isStarted()) return;

    timer.stop();
    await this.dataPointDao.updateOneSetById(dataPoint, { timer });
    await this.upsertDataPoint(profile, user, model, date, timer.calculateTotalSpan());

    return dataPoint;
  }
}
