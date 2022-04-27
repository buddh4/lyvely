import { Injectable } from '@nestjs/common';
import { assureObjectId, EntityIdentity } from '../../db/db.utils';
import {
  ActivityType,
  CalendarIntervalEnum,
  Constructor
} from 'lyvely-common';
import { Profile } from '../../profiles';
import { AbstractContentDao } from '../../content';
import { Activity, ActivityDocument } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FetchQueryOptions } from '../../db/abstract.dao';
import module from "../activities.meta";

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
   * @param tIds
   * @param options
   */
  async findByProfileAndTimingIds(profile: Profile, tIds: string[], options?: FetchQueryOptions<Activity>): Promise<Activity[]> {
    // TODO: content visibility?
    return this.findAll({
      pid: assureObjectId(profile._id),
      $or: [
        { type: ActivityType.Habit },
          // undefined will include undone tasks
         { type: ActivityType.Task, done: { $in: [undefined, ...tIds] } },
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
    return module.id;
  }
}

