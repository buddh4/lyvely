import { User } from '../../users';
import { CalendarDate, toDate, DataPointIntervalFilter, UserAssignmentStrategy } from '@lyvely/common';
import { TimeSeriesContent, DataPoint } from '../schemas';
import { Profile , ProfilesService } from '../../profiles';
import { EntityIdentity } from '../../core/db/db.utils';
import { DataPointDao } from "../daos";
import { Inject } from '@nestjs/common';

export abstract class DataPointService<
    TModel extends TimeSeriesContent,
    TDataPointModel extends DataPoint,
    TValue = any> {

  protected dataPointDao: DataPointDao<TDataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  protected abstract updateDataPointValue(profile: Profile, user: User, dataPoint: TDataPointModel, model: TModel, newValue: TValue);

  async findDataPointByDate(profile: Profile, user: User, content: TModel, date: CalendarDate): Promise<TDataPointModel> {
    return content.userStrategy === UserAssignmentStrategy.PerUser
      ? await this.dataPointDao.findUserDataPointByDate(content, user, date)
      : await this.dataPointDao.findDataPointByDate(content, date);
  }

  /**
   * This function is used to update a DataPointBucket
   * @param profile
   * @param user
   * @param model
   * @param date
   * @param value
   */
  async upsertDataPoint(profile: Profile, user: User, model: TModel, date: CalendarDate, value: TValue): Promise<TDataPointModel> {
    // TODO: Use transaction
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);
    await this.updateDataPointValue(profile, user, dataPoint, model, value);
    return dataPoint;
  }

  protected async findOrCreateDataPointByDate(profile: Profile, user: User, content: TModel, date: CalendarDate): Promise<TDataPointModel> {
    const log = await this.findDataPointByDate(profile, user, content, date);

    if(log) return log;

    const DataPointConstructor = this.dataPointDao.getModelConstructor();
    return await this.dataPointDao.save(new DataPointConstructor(profile, user, content, { date: toDate(date) }));
  }

  async findByIntervalLevel(profile: Profile, uid: EntityIdentity<User> | null, filter: DataPointIntervalFilter): Promise<TDataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(profile, uid, filter);
  }
}
