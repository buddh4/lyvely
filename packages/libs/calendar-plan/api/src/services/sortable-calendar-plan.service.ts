import {
  IntegrityException,
  SortResult,
  assureObjectId,
  DocumentIdentity,
  QuerySort,
  Profile,
  ProtectedProfileContext,
} from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';
import { CalendarPlanService } from './calendar-plan.service';

/**
 * An abstract class that provides sorting functionality for calendar plans.
 * This class extends the base class CalendarPlanService.
 *
 * @template TModel - The type of the calendar plan entity.
 */
export abstract class SortableCalendarPlanService<
  TModel extends CalendarPlanEntity,
> extends CalendarPlanService<TModel> {
  protected abstract override contentDao: ICalendarPlanDao<TModel>;

  /**
   * Updates the calendar interval for a given profile and model.
   * This is used when moving a model from one interval to another, e.g. from Weekly to Daily.
   *
   * @param {Profile} profile - The profile to update the interval configuration for.
   * @param {TModel} model - The model to update the interval configuration for.
   * @param {CalendarInterval} interval - The new interval configuration.
   * @protected
   * @return {Promise<void>} A Promise that resolves when the interval configuration update is complete.
   */
  protected abstract updateIntervalConfig(
    profile: Profile,
    model: TModel,
    interval: CalendarInterval,
  ): Promise<void>;

  /**
   * Re-sorts the given time series content entries by means of the new index and updates the sortOrder of other activities with the same
   * calendar plan accordingly.
   *
   * @param context
   * @param model
   * @param attachToId
   * @param interval
   * @throws ForbiddenServiceException
   */
  async sort(
    context: ProtectedProfileContext,
    model: TModel,
    interval?: CalendarInterval,
    attachToId?: DocumentIdentity<TModel>,
  ): Promise<SortResult[]> {
    interval = interval ?? model.interval;

    const { profile } = context;

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

    interval = attachTo ? attachTo.interval : interval ? interval : model.interval;

    const isSameInterval = interval === model.interval;

    if (!isSameInterval) {
      await this.updateIntervalConfig(profile, model, interval);
    }

    const modelsByInterval = await this.contentDao.findByProfileAndInterval(profile, interval, {
      excludeIds: model._id,
      sort: <QuerySort<TModel>>{ 'meta.sortOrder': 1 },
    });

    const newIndex = attachTo ? modelsByInterval.findIndex((m) => m.id === attachTo.id) + 1 : 0;

    modelsByInterval.splice(newIndex, 0, model);

    return await this.contentDao.updateSortOrder(modelsByInterval);
  }
}
