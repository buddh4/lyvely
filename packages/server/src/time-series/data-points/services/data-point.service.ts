import { User } from '@/users';
import {
  CalendarDate,
  toDate,
  DataPointIntervalFilter,
  UserAssignmentStrategy,
  useDataPointStrategyFacade,
  InvalidDataPointValueTypeException,
  toTimingId,
} from '@lyvely/common';
import { DataPoint } from '../schemas';
import { TimeSeriesContent } from '@/time-series/content';
import { Profile, ProfilesService } from '@/profiles';
import { EntityIdentity } from '@/core';
import { DataPointStrategyDao } from '../daos';
import { Inject } from '@nestjs/common';
import { useDataPointStrategyRegistry } from '@/time-series/data-points/strategies/data-point-processor-strategy.registry';
import { isEqual } from 'lodash';

export interface DataPointUpdateResult<TDataPointModel extends DataPoint> {
  dataPoint: TDataPointModel;
  oldValue?: TDataPointModel['value'];
  isNew: boolean;
}

export abstract class DataPointService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint,
  TValue = any,
> {
  protected abstract dataPointDao: DataPointStrategyDao<TDataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  async findDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
  ): Promise<TDataPointModel> {
    const tid = toTimingId(date, content.timeSeriesConfig.interval, profile.locale);
    return content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
      ? await this.dataPointDao.findUserDataPointByTid(content, user, tid)
      : await this.dataPointDao.findDataPointByTid(content, tid);
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
  ): Promise<DataPointUpdateResult<TDataPointModel>> {
    // TODO: Use transaction
    const result = await this.findOrCreateDataPointByDate(profile, user, model, date, value);
    await this.updateDataPointValue(profile, user, result.dataPoint, model, value);
    await this.postProcess(profile, user, model, result);
    return result;
  }

  protected async postProcess(
    profile: Profile,
    user: User,
    model: TModel,
    updateResult: DataPointUpdateResult<TDataPointModel>,
  ) {
    const { dataPoint } = updateResult;
    const strategy = this.getStrategy(dataPoint.valueType);
    if (strategy) {
      const update = strategy.postProcess(user, model, dataPoint);
      if (typeof update === 'object') {
        await this.dataPointDao.updateOneSetById(dataPoint._id, update);
      }
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
    if (isEqual(dataPoint.value, newValue)) return;
    await this.dataPointDao.updateDataPointValue(user, dataPoint, newValue);
  }

  protected prepareValue(model: TModel, dataPoint: TDataPointModel, newValue: TValue): TValue {
    const strategy = useDataPointStrategyFacade().getService(model.timeSeriesConfig.valueType);

    newValue = strategy.prepareValue(model.timeSeriesConfig, newValue);

    if (!strategy.validateValue(model.timeSeriesConfig, newValue)) {
      throw new InvalidDataPointValueTypeException();
    }

    return strategy.prepareValue(model.timeSeriesConfig, newValue);
  }

  protected getStrategy(valueType: string) {
    return useDataPointStrategyRegistry().getStrategy(valueType);
  }

  protected async findOrCreateDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
    value?: TValue,
  ): Promise<DataPointUpdateResult<TDataPointModel>> {
    let dataPoint = await this.findDataPointByDate(profile, user, content, date);

    if (dataPoint) return { dataPoint, isNew: false, oldValue: dataPoint.value };

    const DataPointConstructor = this.dataPointDao.getModelConstructor({
      valueType: content.timeSeriesConfig.valueType,
    });

    dataPoint = await this.dataPointDao.save(
      new DataPointConstructor(profile, user, content, { date: toDate(date), value }),
    );

    return { dataPoint, isNew: true, oldValue: undefined };
  }

  async findByIntervalLevel(
    profile: Profile,
    uid: EntityIdentity<User> | null,
    filter: DataPointIntervalFilter,
  ): Promise<TDataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(profile, uid, filter);
  }
}
