import { User } from '@/users';
import { Profile } from '@/profiles';
import { DataPointService } from './data-point.service';
import { NumberDataPoint } from '../schemas';
import { NumberTimeSeriesContent } from '@/time-series/content';
import { CalendarDate } from '@lyvely/common';

export abstract class NumberDataPointService<
  TimeSeriesModel extends NumberTimeSeriesContent = NumberTimeSeriesContent,
  DataPointModel extends NumberDataPoint = NumberDataPoint,
> extends DataPointService<TimeSeriesModel, DataPointModel, number> {
  async startTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const { dataPoint } = await this.findOrCreateDataPointByDate(profile, user, model, date);

    const timer = dataPoint.getTimer();

    if (!timer.isStarted()) {
      timer.start(user);
      await this.dataPointDao.updateOneSetById(dataPoint, { timer });
    }

    return dataPoint;
  }

  async stopTimer(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate) {
    const { dataPoint } = await this.findOrCreateDataPointByDate(profile, user, model, date);
    const timer = dataPoint.getTimer();

    if (!timer.isStarted()) return;

    timer.stop();
    await this.dataPointDao.updateOneSetById(dataPoint, { timer });
    await this.upsertDataPoint(profile, user, model, date, timer.calculateTotalSpan());

    return dataPoint;
  }
}
