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
} from 'lyvely-common';
import { Profile } from '../../profiles';
import { AbstractContentDao } from '../../content';
import { Activity, ActivityDocument, Habit, Task } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchQueryOptions } from '../../db/abstract.dao';
import module from "../activities.meta";
import { User } from "../../users";
import { ProfileType } from "lyvely-common/.rollup.cache/home/buddha/codebase/projects/lyvely/app/packages/common/src";
import { isGroupProfile } from "lyvely-common";

@Injectable()
export class ActivitiesDao extends AbstractContentDao<Activity> {

  constructor(@InjectModel(Activity.name) protected model: Model<ActivityDocument>) {
    super();
  }

  /**
   * Finds a single activity by given profile and id. If type parameter is given, the search also validates the
   * type of the content against the given activity type, otherwise all types of activities will be searched.
   *
   * @param profile
   * @param id
   * @param type
   */
  async findByProfileAndId(profile: Profile, id: EntityIdentity<Activity>, type?: ActivityType): Promise<Activity> {
    const query = type
      ? {
          _id: assureObjectId(id),
          pid: assureObjectId(profile._id),
          type: type,
        }
      : {
          _id: assureObjectId(id),
          pid: assureObjectId(profile._id),
          $or: [{ type: ActivityType.Habit }, { type: ActivityType.Task }],
        };

    return this.findOne(query);
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
    const uid = assureObjectId(user);

    if(!isGroupProfile(profile)) {
      // Just a small optimization for non group profiles
      return this.findAll({
        pid: assureObjectId(profile._id),
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

    return this.findAll({
      pid: assureObjectId(profile._id),
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

    return this.findAll({
      pid: assureObjectId(profile._id),
      type: type,
      interval: plan,
    }, options);
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

