import { CalendarDate, toDate, toTimingId } from '@lyvely/dates';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import {
  useDataPointStrategyFacade,
  InvalidDataPointValueTypeException,
} from '@lyvely/time-series-interface';
import { UserAssignmentStrategy, ProfileContext, ProtectedProfileContext } from '@lyvely/api';
import { isPlainObject } from '@lyvely/common';
import { DataPoint, TimeSeriesContent } from '../schemas';
import { DataPointStrategyDao } from '../daos';
import { useDataPointStrategyRegistry } from '../strategies';
import { isEqual } from 'lodash';
import { IDataPointUpdateResult } from '../interfaces';

/**
 * This class represents a service class for managing and manipulating data points.
 * @template TModel - The type of the time series content model.
 * @template TDataPointModel - The type of the data point model. Defaults to `DataPoint`.
 * @template TValue - The type of the data point value. Defaults to `any`.
 */
export abstract class DataPointService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
  TValue = any,
> {
  /** The data point dao, responsible for updating and fetching data points. **/
  protected abstract dataPointDao: DataPointStrategyDao<TDataPointModel>;

  constructor(protected dataPointStrategyFacade = useDataPointStrategyFacade()) {}

  /**
   * Finds a data point for a given time series content by date.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {TModel} content - The model content.
   * @param {CalendarDate} date - The date to find the data point for.
   * @returns {Promise<TDataPointModel | null>} - The found data point or null if not found.
   */
  async findDataPointByDate(
    context: ProfileContext,
    content: TModel,
    date: CalendarDate,
  ): Promise<TDataPointModel | null> {
    const { profile } = context;
    const tid = toTimingId(
      date,
      content.timeSeriesConfig.interval,
      profile.locale,
      profile.settings?.calendar,
    );

    // If it is a per-user strategy we can not determine any data points for guests.
    if (content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser && !context.user) {
      return null;
    }

    return content.timeSeriesConfig.userStrategy === UserAssignmentStrategy.PerUser
      ? await this.dataPointDao.findUserDataPointByTid(content, context.user!, tid)
      : await this.dataPointDao.findDataPointByTid(content, tid);
  }

  /**
   * Upserts a data point value.
   *
   * @param {ProtectedProfileContext} context - The context of the operation.
   * @param {TModel} model - The model associated with the data point.
   * @param {CalendarDate} date - The date of the data point.
   * @param {TValue} value - The value of the data point.
   * @returns {Promise<IDataPointUpdateResult<TDataPointModel>>} - A promise that resolves to the updated data point result.
   */
  async upsertDataPoint(
    context: ProtectedProfileContext,
    model: TModel,
    date: CalendarDate,
    value: TValue,
  ): Promise<IDataPointUpdateResult<TDataPointModel>> {
    const result = await this.findOrCreateDataPointByDate(context, model, date, value);
    await this.updateDataPointValue(context, result.dataPoint, model, value);
    await this.postProcess(context, model, result, date);
    return result;
  }

  /**
   * Updates the value of a data point.
   *
   * @param {ProtectedProfileContext} context - The context of the protected profile.
   * @param {TDataPointModel} dataPoint - The data point model to update.
   * @param {TModel} model - The model associated with the data point.
   * @param {TValue} newValue - The new value to set for the data point.
   * @returns {Promise<void>} - A promise that resolves once the data point value has been updated.
   * @protected
   */
  protected async updateDataPointValue(
    context: ProtectedProfileContext,
    dataPoint: TDataPointModel,
    model: TModel,
    newValue: TValue,
  ): Promise<void> {
    newValue = await this.prepareAndValidateValue(model, dataPoint, newValue);
    if (isEqual(dataPoint.value, newValue)) return;
    await this.dataPointDao.updateDataPointValue(context.user, dataPoint, newValue);
  }

  /**
   * Performs post-processing of the data after an update operation.
   * A data point strategy for example may apply additional updates to the data point was saved.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {TModel} model - The time series model.
   * @param {IDataPointUpdateResult<TDataPointModel>} updateResult - The result of the update operation.
   * @param updateDate - The date the update is related to.
   * @returns {Promise<void>} A Promise that resolves after the post-processing is complete.
   * @protected
   */
  protected async postProcess(
    context: ProtectedProfileContext,
    model: TModel,
    updateResult: IDataPointUpdateResult<TDataPointModel>,
    updateDate: CalendarDate,
  ): Promise<void> {
    const { dataPoint } = updateResult;
    const strategy = this.getStrategy(dataPoint.valueType);
    if (strategy) {
      const update = strategy.postProcess(context.user, model, dataPoint, updateDate);
      if (isPlainObject(update)) {
        await this.dataPointDao.updateOneSetById(dataPoint._id, update);
      }
    }
  }

  /**
   * Prepares and validates a new value for a data point.
   * A database strategy may clean up the value to ensure that it complies with certain restrictions or throw an
   * InvalidDataPointValueTypeException in case the value could not be prepared correctly.
   *
   * @param {TModel} model - The model object.
   * @param {TDataPointModel} dataPoint - The data point object.
   * @param {TValue} newValue - The new value to be validated and prepared.
   * @returns {Promise<TValue>} - The validated and prepared new value.
   * @protected
   */
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

  /**
   * Retrieves the strategy for the given value type.
   *
   * @param {string} valueType - The type of value for which to retrieve the strategy.
   * @protected
   * @returns {Strategy} - The strategy corresponding to the given value type.
   */
  private getStrategy(valueType: string) {
    return useDataPointStrategyRegistry().getStrategy(valueType);
  }

  /**
   * Finds or creates a data point by date.
   *
   * @param {ProtectedProfileContext} context - The context object containing profile and user information.
   * @param {TModel} content - The content model.
   * @param {CalendarDate} date - The date of the data point.
   * @param {TValue} [value] - The value of the data point (optional).
   * @returns {Promise<IDataPointUpdateResult<TDataPointModel>>} - A promise that resolves to an object containing the data point, isNew flag, and oldValue.
   */
  async findOrCreateDataPointByDate(
    context: ProtectedProfileContext,
    content: TModel,
    date: CalendarDate,
    value?: TValue,
  ): Promise<IDataPointUpdateResult<TDataPointModel>> {
    const { profile, user } = context;
    let dataPoint = await this.findDataPointByDate(context, content, date);

    if (dataPoint) return { dataPoint, isNew: false, oldValue: dataPoint.value };

    const DataPointConstructor = this.dataPointDao.getModelConstructor(<any>{
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

  /**
   * Retrieves data points based on the given interval level and filter.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter to apply.
   * @return {Promise<TDataPointModel[]>} - The promise that resolves to an array of data point models.
   */
  async findByIntervalLevel(
    context: ProfileContext,
    filter: CalendarPlanFilter,
  ): Promise<TDataPointModel[]> {
    return await this.dataPointDao.findByIntervalLevel(context.profile, context.user, filter);
  }
}
