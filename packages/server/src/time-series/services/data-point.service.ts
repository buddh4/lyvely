import { User } from '@/users';
import {
  CalendarDate,
  toDate,
  DataPointIntervalFilter,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { TimeSeriesContent, DataPoint } from '../schemas';
import { Profile, ProfilesService } from '@/profiles';
import { EntityIdentity } from '@/core';
import { DataPointDao } from '../daos';
import { Inject } from '@nestjs/common';
import { useDataPointValueStrategyRegistry } from '@/time-series/components/data-point-value-strategy.registry';

export abstract class DataPointService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint,
  TValue = any,
> {
  protected abstract dataPointDao: DataPointDao<TDataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  async findDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
  ): Promise<TDataPointModel> {
    return content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
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
  async upsertDataPoint(
    profile: Profile,
    user: User,
    model: TModel,
    date: CalendarDate,
    value: TValue,
  ): Promise<TDataPointModel> {
    // TODO: Use transaction
    const dataPoint = await this.findOrCreateDataPointByDate(profile, user, model, date);
    await this.updateDataPointValue(profile, user, dataPoint, model, value);
    await this.postProcess(user, model, dataPoint);
    return dataPoint;
  }

  protected async postProcess(user: User, model: TModel, dataPoint: TDataPointModel) {
    const strategy = this.getStrategy(dataPoint.valueType);
    if (!strategy) return;
    const update = strategy.postProcess(user, model, dataPoint);
    if (typeof update === 'object') {
      await this.dataPointDao.updateOneSetById(dataPoint._id, update);
    }
  }

  protected async updateDataPointValue(
    profile: Profile,
    user: User,
    dataPoint: TDataPointModel,
    model: TModel,
    newValue: TValue,
  ) {
    newValue = this.prepareValue(model, dataPoint, newValue);
    if (dataPoint.value === newValue) return;
    await this.dataPointDao.updateDataPointValue(user, dataPoint, newValue);
  }

  protected prepareValue(model: TModel, dataPoint: TDataPointModel, newValue: TValue): TValue {
    const strategy = this.getStrategy(dataPoint.valueType);
    return strategy ? strategy.prepareValue(model, dataPoint, newValue) : newValue;
  }

  protected getStrategy(valueType: string) {
    return useDataPointValueStrategyRegistry().getStrategy(valueType);
  }

  protected async findOrCreateDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
  ): Promise<TDataPointModel> {
    const log = await this.findDataPointByDate(profile, user, content, date);

    if (log) return log;

    const DataPointConstructor = this.dataPointDao.getModelConstructor({
      valueType: content.timeSeriesConfig.valueType,
    });

    return await this.dataPointDao.save(
      new DataPointConstructor(profile, user, content, { date: toDate(date) }),
    );
  }

  async findByIntervalLevel(
    profile: Profile,
    uid: EntityIdentity<User> | null,
    filter: DataPointIntervalFilter,
  ): Promise<TDataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(profile, uid, filter);
  }
}
