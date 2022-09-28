import { Injectable } from '@nestjs/common';
import { Activity, Habit, HabitDataPoint } from '../schemas';
import { User } from '../../users';
import { Profile } from '../../profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { assureObjectId, EntityIdentity, IntegrityException } from '@/modules/core';
import { AbstractContentService } from '../../content';
import { HabitDataPointService } from './habit-data-point.service';
import { getTimingIds, DataPointIntervalFilter, CalendarIntervalEnum, SortResult } from '@lyvely/common';

interface IActivitySearchResult {
  activities: Activity[];
  dataPoints: HabitDataPoint[];
}

@Injectable()
export class ActivitiesService extends AbstractContentService<Activity> {
  constructor(protected contentDao: ActivitiesDao, protected activityDataPointService: HabitDataPointService) {
    super(contentDao);
  }

  /**
   * Finds all activities (tasks and habits) and habit data points of a given user matching the given filter.
   *
   * This function will return tasks only if they are undone or where done within the given range of the
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
  async findByFilter(profile: Profile, user: User, filter: DataPointIntervalFilter): Promise<IActivitySearchResult> {
    // Find all calendar ids for the given search date and filter out by filter level
    const tIds = getTimingIds(filter.search);
    if (filter.level > 0) {
      tIds.splice(0, filter.level);
    }

    const activities = await this.contentDao.findByProfileAndTimingIds(profile, user, tIds);
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
   * @param profile
   * @param user
   * @param activity
   * @param attachToId
   * @param interval
   * @throws ForbiddenServiceException
   */
  async sort(
    profile: Profile,
    user: User,
    activity: Activity,
    interval?: CalendarIntervalEnum,
    attachToId?: EntityIdentity<Activity>,
  ): Promise<SortResult[]> {
    interval = interval ?? activity.dataPointConfig.interval;

    const attachToObjectId = attachToId ? assureObjectId(attachToId) : undefined;

    if (attachToObjectId && activity._id.equals(attachToObjectId)) {
      return Promise.resolve([]);
    }

    const attachTo = attachToObjectId ? await this.contentDao.findByProfileAndId(profile, attachToObjectId) : undefined;

    if (attachTo && activity.type !== attachTo.type) {
      throw new IntegrityException('Can not merge habit with task');
    }

    interval = attachTo ? attachTo.dataPointConfig.interval : interval ? interval : activity.dataPointConfig.interval;

    if (interval !== activity.dataPointConfig.interval) {
      // Create new revision for activity in case the latest revision was not today
      const update = { 'dataPointConfig.interval': interval };

      if (activity instanceof Habit && !activity.getRevisionUpdatedAt(new Date())) {
        activity.pushDataPointConfigRevision(activity.dataPointConfig);
        update['dataPointConfig.history'] = activity.dataPointConfig.history;
      }

      await this.contentDao.updateOneByProfileAndIdSet(profile, activity, update);
      activity.dataPointConfig.interval = interval;
    }

    const activitiesByInterval = await this.contentDao.findByProfileAndInterval(profile, activity.type, interval, {
      excludeIds: activity._id,
      sort: { sortOrder: 1 },
    });

    const newIndex = attachTo ? attachTo.sortOrder + 1 : 0;
    activitiesByInterval.splice(newIndex, 0, activity);

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
