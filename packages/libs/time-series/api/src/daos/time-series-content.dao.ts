import { Profile, ContentTypeDao, IFetchQueryOptions, OptionalUser } from '@lyvely/api';
import { TimeSeriesContent } from '../schemas';
import { CalendarInterval } from '@lyvely/dates';

export abstract class TimeSeriesContentDao<
  TModel extends TimeSeriesContent<TModel>,
> extends ContentTypeDao<TModel> {
  /**
   * Returns all time-series content models by given user and tids. The base implementation just returns all
   * entries related to the given profile, sub-classes may implement more sophisticated queries.
   * @param profile
   * @param user
   * @param tIds
   * @param options
   */
  async findByProfileAndTimingIds(
    profile: Profile,
    user: OptionalUser,
    tIds: string[],
    options?: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]> {
    return this.findAllByProfile(profile);
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
    plan: CalendarInterval,
    options: IFetchQueryOptions<TModel> = {},
  ): Promise<TModel[]> {
    return this.findAllByProfile(
      profile,
      {
        'config.timeSeries.interval': plan,
      },
      options,
    );
  }
}
