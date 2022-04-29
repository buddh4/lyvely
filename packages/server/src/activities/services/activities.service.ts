
import { Injectable } from '@nestjs/common';
import { Activity, HabitDataPoint } from '../schemas';
import { User } from '../../users';
import { Profile } from '../../profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { EntityIdentity } from '../../db/db.utils';
import { AbstractContentService } from '../../content';
import { HabitDataPointService } from './habit-data-point.service';
import { getTimingIds, DataPointIntervalFilter, CalendarIntervalEnum } from "lyvely-common";
import { UpdateQuerySet } from "../../db/abstract.dao";

interface ActivitySearchResult {
  activities: Activity[],
  dataPoints: HabitDataPoint[]
}

@Injectable()
export class ActivitiesService extends AbstractContentService<Activity> {

  constructor(
    protected contentDao: ActivitiesDao,
    protected activityDataPointService: HabitDataPointService) {
    super(contentDao);
  }

  /**
   * Finds all activities (tasks and habits) and habit data points of a given user matching the given filter.
   *
   * This function will return task activities only if they are undone or where done within the given range of the
   * range filter.
   *
   * Note: By default this function will include archived activities.
   *
   * @param profile
   * @param user
   * @param filter
   * @throws EntityNotFoundException
   * @throws ForbiddenServiceException
   */
  async findByFilter(profile: Profile, user: User, filter: DataPointIntervalFilter): Promise<ActivitySearchResult> {
    // Find all timing ids for the given search date and filter out by filter level
    const tIds = getTimingIds(filter.search);
    if(filter.level > 0) {
      tIds.splice(0, filter.level);
    }

    const activities = await this.contentDao.findByProfileAndTimingIds(profile, tIds);
    const dataPoints = await this.activityDataPointService.findByIntervalLevel(profile, user, filter);
    return { activities, dataPoints };
  }

  /**
   * Finds an activity by given profile and activity identity.
   *
   * @param profile
   * @param id
   */
  async findByProfileAndId(profile: Profile, id: EntityIdentity<Activity>): Promise<Activity> {
    return this.contentDao.findByProfileAndId(profile, id);
  }

  /**
   * Re-sorts the given activity by means of the new index and updates the sortOrder of other activities with the same
   * calendar plan accordingly.
   *
   * @param user
   * @param identity
   * @param newIndex
   * @throws ForbiddenServiceException
   */
  async sort(user: User, identity: EntityIdentity<Activity>, newIndex: number): Promise<boolean> {
    const { content: activity, profile } = await this.findWritableContentAndProfile(user, identity);

    /**
     *  TODO: add some optimizations e.g.:
     *  newIndex < oldIndex => skip if currentIndex > oldIndex
     *  newIndex < oldIndex => skip indexes < newIndex
     *  ...
     */

    //TODO: add some optimizations e.g. newIndex < oldIndex => skip if currentIndex > oldIndex

    const updates:  { id: EntityIdentity<Activity>, update: UpdateQuerySet<Activity> }[] = [];
    const activities = await this.contentDao.findByProfileAndInterval(profile, activity.type, activity.interval, {
      excludeIds: activity._id,
      sort: { sortOrder: 1 }
    });

    newIndex = ActivitiesService.validateIndex(newIndex, activities);

    if (activity.sortOrder === newIndex) {
      return true;
    }

    activities.splice(newIndex, 0, activity);

    activities.forEach((activity, index) => {
      if(activity.sortOrder !== index) {
        updates.push({ id: activity._id, update: { sortOrder: index } });
      }
    });

    await this.contentDao.updateBulkSet(updates);

    return true;
  }

  private static validateIndex(newIndex: number, itemsToSort: Activity[]): number {
    newIndex = Math.max(newIndex, 0);
    if (newIndex >= itemsToSort.length + 1) {
      newIndex = itemsToSort.length - 1;
    }

    return newIndex;
  }
}
