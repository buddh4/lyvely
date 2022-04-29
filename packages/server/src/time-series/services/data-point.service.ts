import { User } from '../../users';
import { CalendarDate, toDate, DataPointIntervalFilter } from 'lyvely-common';
import { TimeSeriesContent, DataPoint, DataPointMeta } from '../schemas';
import { Profile , ProfilesService } from '../../profiles';
import { EntityIdentity } from '../../db/db.utils';
import { DataPointDao } from "../daos";
import { Inject } from '@nestjs/common';
import { UserAssignmentStrategy } from "lyvely-common";

export abstract class DataPointService<
    TimeSeriesModel extends TimeSeriesContent,
    DataPointModel extends DataPoint,
    Value = any> {

  protected dataPointDao: DataPointDao<DataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  protected abstract updateDataPointValue(profile: Profile, user: User, dataPoint: DataPointModel, model: TimeSeriesModel, newValue: Value);

  async findByIntervalLevel(pid: EntityIdentity<Profile>, uid: EntityIdentity<User> | null, filter: DataPointIntervalFilter): Promise<DataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(pid, uid, filter);
  }

  async upsertDataPoint(profile: Profile, user: User, model: TimeSeriesModel, date: CalendarDate, value: Value): Promise<DataPointModel> {
    // TODO: Use transaction
    const dataPoint = await this.findOrCreateLogByDay(profile, user, model, date);
    await this.updateDataPointValue(profile, user, dataPoint, model, value);
    return dataPoint;
  }

  async findOrCreateLogByDay(profile: Profile, user: User, content: TimeSeriesModel, date: CalendarDate): Promise<DataPointModel> {
    const log = content.userStrategy === UserAssignmentStrategy.PerUser
        ? await this.dataPointDao.findUserDataPointByDate(content, user, date)
        : await this.dataPointDao.findDataPointByDate(content, date);

    if(log) return log;

    const modelData = this.dataPointDao.constructModel({
      meta: DataPointMeta.create(user, profile, content),
      date: toDate(date)
    });

    return await this.dataPointDao.save(modelData);
  }
}
