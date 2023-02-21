import { Injectable } from '@nestjs/common';
import { assureObjectId, IFetchQueryOptions } from '@/core';
import {
  ActivityType,
  DeepPartial,
  UserAssignmentStrategy,
  isTask,
  isHabit,
  ActivityModel,
  ProfileType,
} from '@lyvely/common';
import { Profile } from '@/profiles';
import { Activity, ActivityDocument, Habit, Task } from '../schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import module from '../activities.meta';
import { User } from '@/users';
import { TimeSeriesContentDao } from '@/time-series';

@Injectable()
export class ActivitiesDao extends TimeSeriesContentDao<Activity> {
  @InjectModel(Activity.name)
  protected model: Model<ActivityDocument>;

  /**
   * Finds all Habits and all Tasks which are undone or done within given tIds.
   *
   * @param profile
   * @param user
   * @param tIds
   * @param options
   */
  async findByProfileAndTimingIds(
    profile: Profile,
    user: User,
    tIds: string[],
    options?: IFetchQueryOptions<Activity>,
  ): Promise<Activity[]> {
    // TODO: content visibility and state?

    if (!profile.isOfType(ProfileType.Group)) {
      // Just a small optimization for non group profiles
      return this.findAllByProfile(
        profile,
        {
          $or: [
            { type: ActivityType.Habit },
            {
              type: ActivityType.Task,
              $or: [{ doneBy: [] }, { doneBy: { $elemMatch: { tid: { $in: tIds } } } }],
            },
          ],
        },
        options,
      );
    }

    const uid = assureObjectId(user);

    return this.findAllByProfile(
      profile,
      {
        $or: [
          { type: ActivityType.Habit },
          {
            type: ActivityType.Task,
            $or: [
              { doneBy: [] },
              // We ignore which user done the task on shared tasks
              {
                'config.timeSeries.userStrategy': UserAssignmentStrategy.Shared,
                doneBy: { $elemMatch: { tid: { $in: tIds } } },
              },
              // On per user tasks we only include tasks not done by the given user or done by the given user within the given tid
              {
                'config.timeSeries.userStrategy': UserAssignmentStrategy.PerUser,
                $or: [
                  { doneBy: { $elemMatch: { uid: uid, tid: { $in: tIds } } } },
                  { doneBy: { $not: { $elemMatch: { uid: uid } } } },
                ],
              },
            ],
          },
        ],
      },
      options,
    );
  }

  protected getModelType(): string | null {
    return 'content.activity';
  }

  getModelConstructor(model?: DeepPartial<Activity>) {
    if (isTask(model as ActivityModel)) return Task;
    if (isHabit(model as ActivityModel)) return Habit;
    return Activity;
  }

  getModuleId(): string {
    return module.id;
  }
}
