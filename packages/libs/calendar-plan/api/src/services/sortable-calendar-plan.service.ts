import {
  IntegrityException,
  SortResult,
  assureObjectId,
  EntityIdentity,
  QuerySort,
  Profile,
  User,
} from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';
import { CalendarPlanService } from './calendar-plan.service';

export abstract class SortableCalendarPlanService<
  TModel extends CalendarPlanEntity,
> extends CalendarPlanService<TModel> {
  protected abstract contentDao: ICalendarPlanDao<TModel>;

  protected abstract updateIntervalConfig(
    profile: Profile,
    model: TModel,
    interval: CalendarInterval,
  ): Promise<void>;

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
    interval?: CalendarInterval,
    attachToId?: EntityIdentity<TModel>,
  ): Promise<SortResult[]> {
    interval = interval ?? model.interval;

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

    /*
     *
     *  TODO: add some optimizations e.g.:
     *  newIndex < oldIndex => skip if currentIndex > oldIndex
     *  newIndex < oldIndex => skip indexes < newIndex
     *
     */
  }
}
