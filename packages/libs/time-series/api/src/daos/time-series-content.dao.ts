import { Profile, ContentTypeDao, IFetchQueryOptions, ProfileContext } from '@lyvely/api';
import { TimeSeriesContent } from '../schemas';
import { CalendarInterval } from '@lyvely/dates';

export abstract class TimeSeriesContentDao<
  TModel extends TimeSeriesContent,
> extends ContentTypeDao<TModel> {
  /**
   * Returns all time-series content models by given user and tids. The base implementation just returns all
   * entries related to the given profile, sub-classes may implement more sophisticated queries.
   * @param context
   * @param tIds
   * @param options
   */
  async findByProfileAndTimingIds(
    context: ProfileContext,
    tIds: string[],
    options?: IFetchQueryOptions<TModel>,
  ): Promise<TModel[]> {
    return this.findAllByProfile(context.profile);
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
