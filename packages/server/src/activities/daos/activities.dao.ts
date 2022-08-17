import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import {
  ActivityType,
  CalendarIntervalEnum,
  DeepPartial,
  UserAssignmentStrategy,
  isTask,
  isHabit,
  IActivity,
 isGroupProfile,
  SortResult
} from '@lyvely/common';
import { Profile } from '../../profiles';
import { AbstractContentDao } from '../../content';
import { Activity, ActivityDocument, Habit, Task } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchQueryOptions, UpdateQuerySet } from '../../db/abstract.dao';
import module from "../activities.meta";
import { User } from "../../users";

@Injectable()
export class ActivitiesDao extends AbstractContentDao<Activity> {

  constructor(@InjectModel(Activity.name) protected model: Model<ActivityDocument>) {
    super();
  }

  /**
   * Finds all Habits and all Tasks which are undone or done within given tIds.
   *
   * @param profile
   * @param user
   * @param tIds
   * @param options
   */
  async findByProfileAndTimingIds(profile: Profile, user: User, tIds: string[], options?: FetchQueryOptions<Activity>): Promise<Activity[]> {
    // TODO: content visibility and state?

    if(!isGroupProfile(profile)) {
      // Just a small optimization for non group profiles
      return this.findAllByProfile(profile,{
        $or: [
          { type: ActivityType.Habit },
          {
            type: ActivityType.Task,
            $or: [
              { doneBy: [] },
              { doneBy: { $elemMatch: { tid: { $in: tIds } } } },
            ]
          },
        ],
      }, options);
    }

    const uid = assureObjectId(user);

    return this.findAllByProfile(profile, {
      $or: [
        { type: ActivityType.Habit },
        {
          type: ActivityType.Task,
          $or: [
            { doneBy: [] },
            // We ignore which user done the task on shared tasks
            { userStrategy: UserAssignmentStrategy.Shared, 'doneBy': { $elemMatch: { tid: { $in: tIds } } } },
            // On per user tasks we only include tasks not done by the given user or done by the given user within the given tid
            { userStrategy: UserAssignmentStrategy.PerUser,
              $or: [
                { 'doneBy': { $elemMatch: { uid: uid, tid: { $in: tIds } } } },
                { 'doneBy': { $not: { $elemMatch: { uid: uid } } } },
              ] },
          ]
        },
      ],
    }, options);
  }

  /**
   * Finds activities of a certain type, plan and profile. The exclude parameter may be used to exclude a single activity
   * from the result.
   *
   * @param profile
   * @param type
   * @param plan
   * @param options
   */
  async findByProfileAndInterval(
    profile: Profile,
    type: string,
    plan: CalendarIntervalEnum,
    options: FetchQueryOptions<Activity> = {},
  ): Promise<Activity[]> {

    return this.findAllByProfile(profile, {
      type: type,
      'dataPointConfig.interval': plan,
    }, options);
  }

  /**
   * Updates the sortOrder by array index
   * @param activities
   */
  async updateSortOrder(activities: Activity[]): Promise<SortResult[]> {
    const updates:  { id: EntityIdentity<Activity>, update: UpdateQuerySet<Activity> }[] = [];
    const result: { id: string, sortOrder: number }[] = [];


    activities.forEach((activity, index) => {
      if(activity.sortOrder !== index) {
        updates.push({ id: activity._id, update: { sortOrder: index } });
        activity.sortOrder = index;
        result.push( new SortResult({ id: activity.id, sortOrder: index }))
      }
    });

    await this.updateSetBulk(updates);
    return result;
  }

  protected getModelType(): string | null {
    return 'content.activity';
  }

  getModelConstructor(model?: DeepPartial<Activity>) {
    if(isTask(model as IActivity)) {
      return Task;
    }

    if(isHabit(model as IActivity)) {
      return Habit;
    }

    return Activity;
  }

  getModuleId(): string {
    return module.id;
  }
}

