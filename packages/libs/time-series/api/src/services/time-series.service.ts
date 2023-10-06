import { Profile } from '@lyvely/profiles';
import { User } from '@lyvely/users';
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
import { DataPointService, DataPointUpdateResult } from './data-point.service';
import { ITimeSeriesContentSearchResult } from './time-series-content-search.result';
import { TimeSeriesContentDao } from '../daos';
import { isEqual } from 'lodash';

export abstract class TimeSeriesService<
  TModel extends TimeSeriesContent<TModel>,
  TDataPointModel extends DataPoint = DataPoint,
  TValue = any,
> extends SortableCalendarPlanService<TModel> {
  protected abstract contentDao: TimeSeriesContentDao<TModel>;
  protected abstract dataPointService: DataPointService<TModel, TDataPointModel>;

  async findByFilter(
    profile: Profile,
    user: User | undefined,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>> {
    return this.contentDao.findByProfileAndTimingIds(
      profile,
      user,
      getTimingIds(filter.date, profile.locale, filter.level),
    );
  }

  async findTimeSeries(
    profile: Profile,
    user: User | undefined,
    filter: CalendarPlanFilter,
  ): Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>> {
    const [models, dataPoints] = await Promise.all([
      this.findByFilter(profile, user, filter),
      this.findDataPoints(profile, user, filter),
    ]);

    return { models, dataPoints };
  }

  private async findDataPoints(
    profile: Profile,
    user: User | undefined,
    filter: CalendarPlanFilter,
  ): Promise<TDataPointModel[]> {
    return isInFuture(filter.date, true)
      ? []
      : await this.dataPointService.findByIntervalLevel(profile, user, filter);
  }

  async upsertDataPoint(
    profile: Profile,
    user: User,
    model: TModel,
    date: CalendarDate,
    value: TValue,
  ): Promise<DataPointUpdateResult<TDataPointModel>> {
    const updateResult = await this.dataPointService.upsertDataPoint(
      profile,
      user,
      model,
      date,
      value,
    );
    await this.updateSummary(profile, model, updateResult);
    return updateResult;
  }

  protected async updateSummary(
    profile: Profile,
    model: TModel,
    update: DataPointUpdateResult<TDataPointModel>,
  ) {
    const { dataPoint, oldValue } = update;
    const { tid } = dataPoint;
    if (dataPoint.interval === CalendarInterval.Unscheduled) return;
    if (!implementsINumericDataPoint(dataPoint)) return;
    if (isEqual(dataPoint.value, oldValue)) return;

    const tidWindow = getTidWindow(dataPoint.interval, profile.locale);

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

  protected async updateIntervalConfig(
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
