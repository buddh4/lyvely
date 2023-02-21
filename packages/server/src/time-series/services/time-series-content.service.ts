import { Profile } from '@/profiles';
import { User } from '@/users';
import {
  CalendarIntervalEnum,
  DataPointIntervalFilter,
  getTimingIds,
  IntegrityException,
  SortResult,
} from '@lyvely/common';
import { DataPoint, DataPointService, TimeSeriesContent } from '@/time-series';
import { TimeSeriesContentDao } from '@/time-series/daos/time-series-content.dao';
import { assureObjectId, EntityIdentity, QuerySort } from '@/core';

export interface ITimeSeriesContentSearchResult<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  models: TModel[];
  dataPoints: TDataPointModel[];
}

export abstract class TimeSeriesContentService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  protected abstract contentDao: TimeSeriesContentDao<TModel>;
  protected abstract dataPointService: DataPointService<TModel, TDataPointModel>;

  async findByFilter(
    profile: Profile,
    user: User,
    filter: DataPointIntervalFilter,
  ): Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>> {
    // Find all calendar ids for the given search date and filter out by filter level
    const tIds = getTimingIds(filter.date);
    if (filter.level > 0) {
      tIds.splice(0, filter.level);
    }

    const models = await this.contentDao.findByProfileAndTimingIds(profile, user, tIds);
    const dataPoints = await this.dataPointService.findByIntervalLevel(profile, user, filter);
    return { models, dataPoints };
  }

  /**
   * Re-sorts the given activity by means of the new index and updates the sortOrder of other activities with the same
   * calendar plan accordingly.
   *
   * @param profile
   * @param user
   * @param model
   * @param attachToId
   * @param interval
   * @throws ForbiddenServiceException
   */
  async sort(
    profile: Profile,
    user: User,
    model: TModel,
    interval?: CalendarIntervalEnum,
    attachToId?: EntityIdentity<TModel>,
  ): Promise<SortResult[]> {
    interval = interval ?? model.timeSeriesConfig.interval;

    const attachToObjectId = attachToId ? assureObjectId(attachToId) : undefined;

    if (attachToObjectId && model._id.equals(attachToObjectId)) {
      return Promise.resolve([]);
    }

    const attachTo = attachToObjectId
      ? await this.contentDao.findByProfileAndId(profile, attachToObjectId)
      : undefined;

    if (attachTo && model.type !== attachTo.type) {
      throw new IntegrityException('Can not merge habit with task');
    }

    interval = attachTo
      ? attachTo.timeSeriesConfig.interval
      : interval
      ? interval
      : model.timeSeriesConfig.interval;

    if (interval !== model.timeSeriesConfig.interval) {
      // Create new revision for activity in case the latest revision was not today
      const update = { 'config.timeSeries.interval': interval };

      model.applyTimeSeriesConfigUpdate({ interval });
      update['config.timeSeries.history'] = model.timeSeriesConfig.history;

      await this.contentDao.updateOneByProfileAndIdSet(profile, model, update);
      model.timeSeriesConfig.interval = interval;
    }

    const activitiesByInterval = await this.contentDao.findByProfileAndInterval(
      profile,
      model.type,
      interval,
      {
        excludeIds: model._id,
        sort: <QuerySort<TModel>>{ 'meta.sortOrder': 1 },
      },
    );

    const newIndex = attachTo ? attachTo.meta.sortOrder + 1 : 0;
    activitiesByInterval.splice(newIndex, 0, model);

    return await this.contentDao.updateSortOrder(activitiesByInterval);

    /*const { content: activity, profile } = await this.findWritableContentAndProfile(user, identity);

    **
     *  TODO: add some optimizations e.g.:
     *  newIndex < oldIndex => skip if currentIndex > oldIndex
     *  newIndex < oldIndex => skip indexes < newIndex
     *  ...
     *

    //TODO: add some optimizations e.g. newIndex < oldIndex => skip if currentIndex > oldIndex */
  }
}
