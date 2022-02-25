import { User } from '../../users/schemas/users.schema';
import {
  CalendarDate,
  TimeSeriesRangeFilter,
  getTimingIdsByRange, Calendar,
  ITimeSeriesDataPoint
} from 'lyvely-common';
import { Model } from 'mongoose';
import { TimeSeriesContent, TimeSeriesDataPointConstructor, TimeSeriesDataPointDocument } from '../schemas';
import { Profile , ProfilesService } from '../../profiles';

import { assureObjectId } from '../../db/db.utils';

export abstract class TimeSeriesDataPointService<
  Doc extends TimeSeriesDataPointDocument,
  LogModel extends ITimeSeriesDataPoint,
  MainModel extends TimeSeriesContent,
> {
  protected LogModel: Model<TimeSeriesDataPointDocument>;

  protected profileService: ProfilesService;

  abstract getLogModelConstructor(): TimeSeriesDataPointConstructor<MainModel>;
  abstract updateLogValue(profile: Profile, log: LogModel, model: MainModel, value: any): Promise<LogModel>;

  createModel(raw: ITimeSeriesDataPoint): LogModel {
    const ModelConstructor = this.getLogModelConstructor();
    return <LogModel> new ModelConstructor(raw);
  }

  async findLogsByRange(profile: Profile, filter: TimeSeriesRangeFilter): Promise<LogModel[]> {
    const timingIds = getTimingIdsByRange(filter, profile.getLocale());

    if (!timingIds.length) {
      return Promise.resolve([]);
    }

    // TODO: Move to dao
    const logs = (await this.LogModel.find({
      pid: assureObjectId(profile),
      timingId: { $in: timingIds },
    }).lean()) as LogModel[];

    return logs.map((log: LogModel) => this.createModel(log));
  }

  async updateLog(user: User, profile: Profile, timingModel: MainModel, date: CalendarDate, update: any): Promise<LogModel> {
    const log = await this.findOrCreateLogByDay(user, profile, timingModel, date);
    return await this.updateLogValue(profile, log, timingModel, update);
  }

  protected async findOrCreateLogByDay(user: User, profile: Profile, timingModel: MainModel, date: CalendarDate): Promise<LogModel> {
    const timing = Calendar.createTiming(timingModel.interval, date, profile.getLocale());
    const log = await this.findLog(timingModel, timing._id);

    if (!log) {
      // TODO: Move to dao
      const doc = await new this.LogModel(this.getLogModelConstructor().create(user, profile, timingModel, date)).save();
      return this.createModel(doc.toObject());
    }

    return this.createModel(log);
  }

  // TODO: Move to dao
  protected async findLog(timingModel: MainModel, timingId: string): Promise<Doc> {
    return <Doc> await this.LogModel.findOne({
      contentId: assureObjectId(timingModel),
      timingId: timingId,
    }).lean();
  }
}
