import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import { ActivityType , CalendarIntervalEnum, Constructor } from 'lyvely-common';
import { Profile } from '../../profiles';
import { AbstractContentDao } from '../../content';

import { Activity, ActivityDocument } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchQueryOptions } from '../../db/abstract.dao';

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
   * Finds all habits and all tasks done within the given timing of a given profile. By adding an `undefined` timingId, this
   * function will also include undone tasks.
   *
   * @param profile
   * @param timingIds
   * @param options
   */
  async findByProfileAndTimingIds(profile: Profile, timingIds: string[], options?: FetchQueryOptions<Activity>): Promise<Activity[]> {
    return this.findAll({
      pid: assureObjectId(profile._id),
      $or: [
        { type: ActivityType.Habit },
        { type: ActivityType.Task, done: { $in: timingIds } },
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

  getModelConstructor(): Constructor<Activity> {
    return Activity;
  }

  getModuleId(): string {
    return 'activities';
  }
}

