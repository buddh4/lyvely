import { ContentService, Profile, ProfileContext, ProtectedProfileContext } from '@lyvely/api';
import { CalendarDate, CalendarInterval, getTimingIds, isInFuture } from '@lyvely/dates';
import {
  CalendarPlanFilter,
  getTidWindow,
  SortableCalendarPlanService,
} from '@lyvely/calendar-plan';
import { implementsINumericDataPoint } from '@lyvely/time-series-interface';
import {
  DataPoint,
  TimeSeriesContent,
  TimeSeriesSummaryWindowEntry,
  useDataPointConfigHandler,
} from '../schemas';
import { IDataPointUpdateResult } from '../interfaces';
import { DataPointService } from './data-point.service';
import { ITimeSeriesContentSearchResult } from '../interfaces/time-series-content-search.result';
import { TimeSeriesContentDao } from '../daos';
import { isEqual } from 'lodash';
import { Inject } from '@nestjs/common';

/**
 * Represents the base service class for TimeSeries features.
 * The service is responsible for fetching TimeSeriesContent and DataPoints as well as updating DataPoints.
 * This service extends the SortableCalendarPlanService, which includes CalendarPlan features as moving and sorting
 * TimeSeriesContent entries between intervals.
 *
 * @class TimeSeriesService
 * @description Represents a service for managing time series data.
 * @template TModel - The type of time series content model.
 * @template TDataPointModel - The type of data point model.
 * @template TValue - The type of value in the data points.
 */
export abstract class TimeSeriesService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
  TValue = any,
> extends SortableCalendarPlanService<TModel> {
  /**
   * Defines the dao of the related TimeSeriesContent type used for updating and fetching instances.
   * @template TModel - The type of the model representing a calendar plan.
   */
  protected abstract override contentDao: TimeSeriesContentDao<TModel>;

  /**
   * Defines the DataPointService related to this type of TimeSeriesContent.
   * @template TModel - The type of the model representing a calendar plan.
   * @template TDataPointModel - The type of the data-point model representing a calendar plan.
   */
  protected abstract dataPointService: DataPointService<TModel, TDataPointModel>;

  /**
   * Content Service instance, used to populate content entries.
   * @class
   */
  @Inject()
  protected contentService: ContentService;

  /**
   * Retrieves an array of models based on the specified filter.
   *
   * @param {ProfileContext} context - The context of the profile.
   * @param {CalendarPlanFilter} filter - The filter to be applied on the models.
   *
   * @return {Promise<Array<TModel>>} - A promise that resolves to an array of models*/
  override async findByFilter(
    context: ProfileContext,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>> {
    const { profile } = context;
    const models = await this.contentDao.findByProfileAndTimingIds(
      context,
      getTimingIds(filter.date, profile.locale, filter.level, profile.settings?.calendar),
    );

    await this.contentService.populateContentPolicies(models, context);
    return models;
  }

  /**
   * Finds time series content and related data-points based on the given context and filter.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter to apply.
   *
   * @returns {Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>>} - A promise that resolves to the time series content search result, which includes an array of models and
   * data points.
   */
  async findTimeSeries(
    context: ProfileContext,
    filter: CalendarPlanFilter,
  ): Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>> {
    const [models, dataPoints] = await Promise.all([
      this.findByFilter(context, filter),
      this.findDataPoints(context, filter),
    ]);

    await this.contentService.populateContentPolicies(models, context);

    return { models, dataPoints };
  }

  /**
   * Finds the data points based on the given filter.
   *
   * @param {ProfileContext} context - The profile context.
   * @param {CalendarPlanFilter} filter - The filter for finding the data points.
   * @return {Promise<TDataPointModel[]>} A promise that resolves to an array of data points.
   * @private
   */
  private async findDataPoints(
    context: ProfileContext,
    filter: CalendarPlanFilter,
  ): Promise<TDataPointModel[]> {
    return isInFuture(filter.date, true)
      ? []
      : await this.dataPointService.findByIntervalLevel(context, filter);
  }

  /**
   * Upserts a data point and the model summary.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {TModel} model - The model to upsert the data point for.
   * @param {CalendarDate} date - The date of the data point.
   * @param {TValue} value - The value of the data point.
   *
   * @return {Promise<IDataPointUpdateResult<TDataPointModel>>} A promise that resolves with the result of the upsert operation.
   */
  async upsertDataPoint(
    context: ProtectedProfileContext,
    model: TModel,
    date: CalendarDate,
    value: TValue,
  ): Promise<IDataPointUpdateResult<TDataPointModel>> {
    const updateResult = await this.dataPointService.upsertDataPoint(context, model, date, value);
    await this.updateSummary(context, model, updateResult);
    return updateResult;
  }

  /**
   * Updates the summary of a time series content based on the given update.
   *
   * @param {ProtectedProfileContext} context - The context of the protected profile.
   * @param {TModel} model - The model to update.
   * @param {IDataPointUpdateResult<TDataPointModel>} update - The update result of a data point.
   * @protected
   * @returns {Promise<void>} - A promise that resolves when the summary is updated.
   */
  protected async updateSummary(
    context: ProtectedProfileContext,
    model: TModel,
    update: IDataPointUpdateResult<TDataPointModel>,
  ) {
    const { profile } = context;
    const { dataPoint, oldValue } = update;
    const { tid } = dataPoint;
    if (dataPoint.interval === CalendarInterval.Unscheduled) return;
    if (!implementsINumericDataPoint(dataPoint)) return;
    if (isEqual(dataPoint.value, oldValue)) return;

    const tidWindow = getTidWindow(dataPoint.interval, context.profile.locale);

    if (!tidWindow.includes(tid)) return;

    const newValue = dataPoint.numericValue;
    const existingEntry = model.timeSeriesSummary.window.find((entry) => entry.tid === tid);

    if (existingEntry && existingEntry.value === newValue) return;

    if (existingEntry) {
      existingEntry.value = newValue;
    } else {
      model.timeSeriesSummary.window.push(new TimeSeriesSummaryWindowEntry(tid, newValue));
    }

    model.timeSeriesSummary.window = model.timeSeriesSummary.window
      .filter((entry) => tidWindow.includes(entry.tid))
      .sort((a, b) => {
        const indexA = tidWindow.findIndex((tid) => tid === a.tid);
        const indexB = tidWindow.findIndex((tid) => tid === b.tid);
        return indexA - indexB;
      });

    return this.contentDao.updateOneByProfileAndIdSet(profile, model, {
      timeSeriesSummary: model.timeSeriesSummary,
    });
  }

  /**
   * Updates the interval configuration of a model's time series.
   *
   * @param profile
   * @param {TModel} model - The model for which the interval configuration is being updated.
   * @param {CalendarInterval} interval - The new interval value to be set for the time series.
   * @protected
   * @return {Promise<void>} - A Promise that resolves when the interval configuration is successfully updated.
   */
  protected override async updateIntervalConfig(
    profile: Profile,
    model: TModel,
    interval: CalendarInterval,
  ) {
    const update = { 'config.timeSeries.interval': interval };
    useDataPointConfigHandler().applyUpdate(model, { interval });
    update['config.timeSeries.history'] = model.timeSeriesConfig.history;

    await this.contentDao.updateOneByProfileAndIdSet(profile, model, update);
    model.timeSeriesConfig.interval = interval;
  }
}
