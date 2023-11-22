import { CalendarDate, toDate, toTimingId } from '@lyvely/dates';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import {
  useDataPointStrategyFacade,
  InvalidDataPointValueTypeException,
} from '@lyvely/time-series-interface';
import { UserAssignmentStrategy } from '@lyvely/common';
import { DataPoint, TimeSeriesContent } from '../schemas';
import { User, EntityIdentity, Profile, ProfilesService } from '@lyvely/api';
import { DataPointStrategyDao } from '../daos';
import { Inject } from '@nestjs/common';
import { useDataPointStrategyRegistry } from '../strategies';
import { isEqual } from 'lodash';

export interface IDataPointUpdateResult<TDataPointModel extends DataPoint> {
  dataPoint: TDataPointModel;
  oldValue?: TDataPointModel['value'];
  isNew: boolean;
}

export abstract class DataPointService<
  TModel extends TimeSeriesContent<TModel>,
  TDataPointModel extends DataPoint = DataPoint,
  TValue = any,
> {
  protected abstract dataPointDao: DataPointStrategyDao<TDataPointModel>;

  @Inject()
  protected profileService: ProfilesService;

  constructor(protected dataPointStrategyFacade = useDataPointStrategyFacade()) {}

  async findDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
  ): Promise<TDataPointModel | null> {
    const tid = toTimingId(
      date,
      content.timeSeriesConfig.interval,
      profile.locale,
      profile.settings?.calendar,
    );
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
  ): Promise<IDataPointUpdateResult<TDataPointModel>> {
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
    updateResult: IDataPointUpdateResult<TDataPointModel>,
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
    newValue = await this.prepareAndValidateValue(model, dataPoint, newValue);
    if (isEqual(dataPoint.value, newValue)) return;
    await this.dataPointDao.updateDataPointValue(user, dataPoint, newValue);
  }

  protected async prepareAndValidateValue(
    model: TModel,
    dataPoint: TDataPointModel,
    newValue: TValue,
  ): Promise<TValue> {
    const strategy = this.dataPointStrategyFacade.getService(model.timeSeriesConfig.valueType);
    newValue = strategy.prepareValue(model.timeSeriesConfig, newValue, dataPoint.value);

    if (!(await strategy.validateValue(model.timeSeriesConfig, newValue))) {
      throw new InvalidDataPointValueTypeException();
    }

    return newValue;
  }

  protected getStrategy(valueType: string) {
    return useDataPointStrategyRegistry().getStrategy(valueType);
  }

  async findOrCreateDataPointByDate(
    profile: Profile,
    user: User,
    content: TModel,
    date: CalendarDate,
    value?: TValue,
  ): Promise<IDataPointUpdateResult<TDataPointModel>> {
    let dataPoint = await this.findDataPointByDate(profile, user, content, date);

    if (dataPoint) return { dataPoint, isNew: false, oldValue: dataPoint.value };

    const DataPointConstructor = this.dataPointDao.getModelConstructor({
      valueType: content.timeSeriesConfig.valueType,
    });

    dataPoint = await this.dataPointDao.save(
      new DataPointConstructor(profile, user, content, {
        date: toDate(date),
        value,
        valueType: content.timeSeriesConfig.valueType,
      }),
    );

    return { dataPoint, isNew: true, oldValue: undefined };
  }

  async findByIntervalLevel(
    profile: Profile,
    uid: EntityIdentity<User> | null | undefined,
    filter: CalendarPlanFilter,
  ): Promise<TDataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(profile, uid, filter);
  }
}
