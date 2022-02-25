
import { Injectable } from '@nestjs/common';
import { Activity, ActivityDataPoint } from '../schemas';
import { User } from '../../users/schemas/users.schema';
import { Profile } from '../../profiles';
import { TimeSeriesRangeFilter, getTimingIdsByRange } from 'lyvely-common';
import { ActivitiesDao } from '../daos/activities.dao';
import { EntityIdentity } from '../../db/db.utils';
import { AbstractContentService } from '../../content/services/abstract-content.service';
import { ActivityDataPointService } from './activity-data-point.service';

@Injectable()
export class ActivitiesService extends AbstractContentService<Activity> {

  constructor(
    protected contentDao: ActivitiesDao,
    protected activityLogService: ActivityDataPointService) {
    super(contentDao);
  }

  /**
   * Finds all activities and logs of a given user matching the given range filter,
   * only if this user has the required write permission on the profile.
   *
   * This function will return task activities only if they are undone or where done within the given range of the
   * range filter.
   *
   * Note: By default this function will include archived activities.
   *
   * @param profile
   * @param filter
   * @throws EntityNotFoundException
   * @throws ForbiddenServiceException
   */
  async findByRangeFilter(profile: Profile, filter: TimeSeriesRangeFilter): Promise<{activities: Activity[], logs: ActivityDataPoint[]}> {
    const timingIds = getTimingIdsByRange(filter, profile.getLocale());

    // Includes undone tasks;
    timingIds.push(undefined);

    const activities = await this.contentDao.findByProfileAndTimingIds(profile, timingIds);
    const logs = await this.activityLogService.findLogsByRange(profile, filter);

    return {activities: activities, logs: logs};
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

    const updates:  {id: EntityIdentity<Activity>, update: unknown}[] = [];
    const activities = await this.contentDao.findByProfileAndInterval(profile, activity.type, activity.interval, {
      excludeIds: activity._id,
      sort: { sortOrder: 1}
    });

    newIndex = ActivitiesService.validateIndex(newIndex, activities);

    if (activity.sortOrder === newIndex) {
      return true;
    }

    activities.splice(newIndex, 0, activity);

    activities.forEach((activity, index) => {
      if(activity.sortOrder !== index) {
        updates.push({id: activity._id, update: { sortOrder: index }});
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
