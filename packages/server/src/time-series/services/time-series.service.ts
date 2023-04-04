import { Profile } from '@/profiles';
import { User } from '@/users';
import { DataPointIntervalFilter, getTimingIds, isInFuture } from '@lyvely/common';
import { DataPoint, DataPointService } from '../data-points';
import { TimeSeriesContent, TimeSeriesContentDao } from '../content';
import { SortableTimeSeriesService } from '@/time-series/services/sortable-time-series.service';

export interface ITimeSeriesContentSearchResult<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  models: TModel[];
  dataPoints?: TDataPointModel[];
}

export abstract class TimeSeriesService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> extends SortableTimeSeriesService<TModel> {
  protected abstract contentDao: TimeSeriesContentDao<TModel>;
  protected abstract dataPointService: DataPointService<TModel, TDataPointModel>;

  async findByFilter(
    profile: Profile,
    user: User,
    filter: DataPointIntervalFilter,
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
}
