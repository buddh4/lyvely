import { User } from '@/users';
import { Profile } from '@/profiles';
import { DataPointService } from './data-point.service';
import { NumberDataPoint, NumberTimeSeriesContent } from '../schemas';
import { CalendarDate } from '@lyvely/common';
import { Timer } from '@/calendar';

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
    if (dataPoint.value === newValue) {
      return;
    }

    await this.dataPointDao.updateDataPointValue(user, dataPoint, Math.min(newValue, model.dataPointConfig.max));
  }

  async startTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);

    if (!dataPoint.timer) {
      dataPoint.timer = new Timer();
    }

    if (!dataPoint.timer.isStarted()) {
      dataPoint.timer.start(user);
      await this.dataPointDao.updateOneSetById(dataPoint, { timer: dataPoint.timer });
    }

    return dataPoint;
  }

  async stopTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);
    if (!dataPoint.timer?.isStarted()) return;

    dataPoint.timer.stop();
    await this.dataPointDao.updateOneSetById(dataPoint, { timer: dataPoint.timer });

    await this.upsertDataPoint(profile, user, model, date, dataPoint.timer.calculateTotalSpan());

    return dataPoint;
  }
}
