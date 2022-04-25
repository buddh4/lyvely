import { User } from '../../users';
import {
  CalendarDate,
  TimeSeriesRangeFilter,
  getTimingIdsByRange, Calendar, DeepPartial, dateTime
} from 'lyvely-common';
import { Model } from 'mongoose';
import { TimeSeries, TimeSeriesDataPointConstructor, DataPointDocument, DataPoint } from '../schemas';
import { Profile , ProfilesService } from '../../profiles';
import { assureObjectId } from '../../db/db.utils';

export abstract class DataPointService<
  Doc extends DataPointDocument,
  LogModel extends DataPoint,
  MainModel extends TimeSeries> {

  protected LogModel: Model<DataPointDocument>;

  protected profileService: ProfilesService;

  abstract getLogModelConstructor(): TimeSeriesDataPointConstructor<MainModel>;
  abstract updateLogValue(profile: Profile, log: LogModel, model: MainModel, value: any): Promise<LogModel>;

  constructModel(raw: DeepPartial<LogModel>): LogModel {
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

    return logs.map((log: LogModel) => this.constructModel(log));
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
      const model = this.constructModel({
        meta: {
          uid: user._id,
          pid: profile._id,
          cid: timingModel._id,
          interval: timingModel.interval
        },
        date: dateTime(date).toDate()
      });
      const doc = await new this.LogModel(model).save();
      return this.constructModel(doc);
    }

    return this.constructModel(log);
  }

  // TODO: Move to dao
  protected async findLog(timingModel: MainModel, timingId: string): Promise<Doc> {
    return <Doc> await this.LogModel.findOne({
      contentId: assureObjectId(timingModel),
      timingId: timingId,
    }).lean();
  }
}
