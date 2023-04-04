import { Profile } from '@/profiles';
import { User } from '@/users';
import {
  CalendarIntervalEnum,
  DataPointIntervalFilter,
  IntegrityException,
  SortResult,
} from '@lyvely/common';
import { DataPoint } from '../data-points';
import { TimeSeriesContent, TimeSeriesContentDao } from '../content';
import { DataPointConfigHandler } from '../components';
import { assureObjectId, EntityIdentity, QuerySort } from '@/core';

export interface ITimeSeriesContentSearchResult<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  models: TModel[];
  dataPoints?: TDataPointModel[];
}

export abstract class SortableTimeSeriesService<
  TModel extends TimeSeriesContent,
  TDataPointModel extends DataPoint = DataPoint,
> {
  protected abstract contentDao: TimeSeriesContentDao<TModel>;

  abstract findByFilter(
    profile: Profile,
    user: User,
    filter: DataPointIntervalFilter,
  ): Promise<ITimeSeriesContentSearchResult<TModel, TDataPointModel>>;

  /**
   * Re-sorts the given time series content entries by means of the new index and updates the sortOrder of other activities with the same
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
      throw new IntegrityException('Can not sort different content types');
    }

    interval = attachTo
      ? attachTo.timeSeriesConfig.interval
      : interval
      ? interval
      : model.timeSeriesConfig.interval;

    const isSameInterval = interval === model.timeSeriesConfig.interval;

    if (!isSameInterval) {
      // Create new revision for activity in case the latest revision was not today
      const update = { 'config.timeSeries.interval': interval };

      DataPointConfigHandler.applyUpdate(model, { interval });
      update['config.timeSeries.history'] = model.timeSeriesConfig.history;

      await this.contentDao.updateOneByProfileAndIdSet(profile, model, update);
      model.timeSeriesConfig.interval = interval;
    }

    const modelsByInterval = await this.contentDao.findByProfileAndInterval(profile, interval, {
      excludeIds: model._id,
      sort: <QuerySort<TModel>>{ 'meta.sortOrder': 1 },
    });

    const newIndex = attachTo ? modelsByInterval.findIndex((m) => m.id === attachTo.id) + 1 : 0;

    modelsByInterval.splice(newIndex, 0, model);

    return await this.contentDao.updateSortOrder(modelsByInterval);

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
