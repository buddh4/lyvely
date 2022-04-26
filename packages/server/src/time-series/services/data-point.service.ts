import { User } from '../../users';
import { CalendarDate, toDate } from 'lyvely-common';
import { TimeSeriesContent, DataPoint, DataPointMeta } from '../schemas';
import { Profile , ProfilesService } from '../../profiles';
import { EntityIdentity } from '../../db/db.utils';
import { DataPointDao, DataPointIntervalFilter } from "../daos/data-point.dao";
import { Inject } from '@nestjs/common';

export abstract class DataPointService<
    TimeSeriesModel extends TimeSeriesContent,
    DataPointModel extends DataPoint,
    Value = any> {

  protected dataPointDao: DataPointDao<DataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  protected abstract updateLogValue(profile: Profile, log: DataPointModel, model: TimeSeriesModel, value: Value): Promise<DataPointModel>;

  async findByIntervalLevel(pid: EntityIdentity<Profile>, uid: EntityIdentity<User> | null, filter: DataPointIntervalFilter): Promise<DataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(pid, uid, filter);
  }

  async updateLog(user: User, profile: Profile, model: TimeSeriesModel, date: CalendarDate, update: Value): Promise<DataPointModel> {
    const log = await this.findOrCreateLogByDay(user, profile, model, date);
    return await this.updateLogValue(profile, log, model, update);
  }

  async findOrCreateLogByDay(user: User, profile: Profile, content: TimeSeriesModel, date: CalendarDate): Promise<DataPointModel> {
    const log = await this.dataPointDao.findLogByDate(content, date);

    if(log) {
      return log;
    }

    const modelData = this.dataPointDao.constructModel({
      meta: DataPointMeta.create(user, profile, content),
      date: toDate(date)
    });

    return await this.dataPointDao.create(modelData);
  }
}
