import {
  IntegrityException,
  SortResult,
  assureObjectId,
  DocumentIdentity,
  QuerySort,
  Profile,
  ProtectedProfileContentContext,
} from '@lyvely/api';
import { CalendarInterval } from '@lyvely/dates';
import { ICalendarPlanDao, CalendarPlanEntity } from '../interfaces';
import { CalendarPlanService } from './calendar-plan.service';
import { isNotNil } from '@lyvely/common';

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
   * Re-sorts the given time series content entries by means of the new index and updates the sortOrder of other activities with the same
   * calendar plan accordingly.
   *
   * @param context
   * @param attachToId
   * @param interval
   * @throws ForbiddenServiceException
   */
  async sort(
    context: ProtectedProfileContentContext<TModel>,
    interval?: CalendarInterval,
    attachToId?: DocumentIdentity<TModel>
  ): Promise<SortResult[]> {
    const { content, profile } = context;

    interval ??= content.interval;

    const attachToObjectId = attachToId ? assureObjectId(attachToId) : undefined;

    if (attachToObjectId && content._id.equals(attachToObjectId)) {
      return Promise.resolve([]);
    }

    const attachTo = attachToObjectId
      ? await this.contentDao.findByProfileAndId(profile, attachToObjectId)
      : undefined;

    if (attachTo && content.type !== attachTo.type) {
      throw new IntegrityException('Can not sort different content types');
    }

    interval = attachTo ? attachTo.interval : isNotNil(interval) ? interval : content.interval;

    const isSameInterval = interval === content.interval;

    if (!isSameInterval) {
      await this.contentDao.updateInterval(context, interval);
    }

    const modelsByInterval = await this.contentDao.findByInterval(
      context,
      { archived: false, interval },
      {
        excludeIds: content._id,
        sort: <QuerySort<TModel>>{ 'meta.sortOrder': 1 },
      }
    );

    const newIndex = attachTo ? modelsByInterval.findIndex((m) => m.id === attachTo.id) + 1 : 0;

    modelsByInterval.splice(newIndex, 0, content);

    return await this.contentDao.updateSortOrder(modelsByInterval);
  }
}
