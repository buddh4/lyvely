import { Profile } from '@/profiles';
import { User } from '@/users';
import { CalendarInterval, CalendarPlanFilter, getTimingIds, isInFuture } from '@lyvely/common';
import { DataPoint, TimeSeriesContent, useDataPointConfigHandler } from '../schemas';
import { DataPointService } from './data-point.service';
import { ITimeSeriesContentSearchResult } from './time-series-content-search.result';
import { TimeSeriesContentDao } from '../daos';
import { SortableCalendarPlanService } from '@/calendar-plan';

export abstract class TimeSeriesService<
  TModel extends TimeSeriesContent<TModel>,
  TDataPointModel extends DataPoint = DataPoint,
> extends SortableCalendarPlanService<TModel> {
  protected abstract contentDao: TimeSeriesContentDao<TModel>;
  protected abstract dataPointService: DataPointService<TModel, TDataPointModel>;

  async findByFilter(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<Array<TModel>> {
    return this.contentDao.findAllByProfile(profile);
  }

  async findTimeSeries(
    profile: Profile,
    user: User,
    filter: CalendarPlanFilter,
  ): Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>> {
    return {
      models: await this.contentDao.findByProfileAndTimingIds(
        profile,
        user,
        getTimingIds(filter.date, profile.locale, filter.level),
      ),
      dataPoints: isInFuture(filter.date, true)
        ? []
        : await this.dataPointService.findByIntervalLevel(profile, user, filter),
    };
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
