import { AbstractDao, assureObjectId, EntityIdentity } from '@/core';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { DataPoint, TimeSeriesContent } from '../schemas';
import { getTimingIds, DataPointIntervalFilter, CalendarIntervalEnum } from '@lyvely/common';

type InterValFilter = { interval: CalendarIntervalEnum; tid?: string | { $regex: RegExp } };

export abstract class DataPointStrategyDao<
  T extends DataPoint<any> = DataPoint<any>,
> extends AbstractDao<T> {
  // TODO: Implement update interval of data points

  async updateDataPointValue(
    uid: EntityIdentity<User>,
    dataPoint: DataPoint<any>,
    value: T['value'],
  ) {
    return await this.updateOneSetById(dataPoint as EntityIdentity<T>, {
      valueType: dataPoint.valueType,
      value,
    });
  }

  async findDataPointByTid(content: TimeSeriesContent, tid: string) {
    // TODO: (TimeSeries History) fetch interval from history
    return this.findOne({
      cid: assureObjectId(content),
      tid,
    });
  }

  async findUserDataPointByTid(content: TimeSeriesContent, uid: EntityIdentity<User>, tid: string) {
    // TODO: (TimeSeries History) fetch interval from history
    return this.findOne({
      cid: assureObjectId(content),
      uid: assureObjectId(uid),
      tid,
    });
  }

  /**
   * Finds all data point of a profile filtered by a data point interval filter. Note, this may include multiple data
   * points of the same content which may need to be merged in presentation layer.
   *
   * The interval filter is used to exclude data points which may already be loaded, e.g. on initial load we include
   * data points of unscheduled content. On next load, we do not want to load them again. The filter also includes
   * a day tid to query for data points within a specific interval e.g:
   *
   * The following filter will include daily + weekly data points of week of year 14 and day of month 5
   *
   * tid: Y:2021;Q:2;M:4;W:14;D:5
   * interval: Weekly
   *
   *
   * An empty uid should only be given for visitor roles.
   * // TODO: (visitor) implement and test visitor view
   * @param profile
   * @param uid
   * @param filter
   */
  async findByIntervalLevel(
    profile: Profile,
    uid: EntityIdentity<User> | null,
    filter: DataPointIntervalFilter,
  ) {
    // If no uid is given we assume visitor role
    const uidFilter = uid
      ? {
          $or: [{ uid: assureObjectId(uid) }, { uid: null }],
        }
      : { uid: null };

    return this.findAll({
      $and: [
        { pid: assureObjectId(profile) },
        uidFilter,
        this.buildTimingIntervalFilter(profile, filter),
      ],
    });
  }

  private buildTimingIntervalFilter(profile: Profile, filter: DataPointIntervalFilter) {
    const timingIds = getTimingIds(filter.date, profile.locale);
    const relevantTids = [];

    for (let i = CalendarIntervalEnum.Daily; i >= 0; i--) {
      if (filter.level <= i) {
        relevantTids.push(timingIds[i]);
      }
    }

    return { tid: { $in: relevantTids } };
  }

  /**
   * This was intended to be able to load data points for time series which changed tid.
   * Since we use the history in the frontend, we do not need this for usual use-cases but maybe in the future.
   *
   * @param profile
   * @param filter
   * @private
   */
  private buildTimingRegexIntervalFilter(profile: Profile, filter: DataPointIntervalFilter) {
    const timingIds = getTimingIds(filter.date, profile.locale);
    const dailyFilter = {
      interval: CalendarIntervalEnum.Daily,
      tid: timingIds[CalendarIntervalEnum.Daily],
    };

    if (filter.level === CalendarIntervalEnum.Daily) {
      return dailyFilter;
    }

    const intervalFilter: InterValFilter[] = [dailyFilter];

    for (let i = CalendarIntervalEnum.Weekly; i >= 0; i--) {
      if (filter.level <= i) {
        const filter =
          i === CalendarIntervalEnum.Unscheduled
            ? { interval: i }
            : { interval: i, tid: { $regex: new RegExp(`^${timingIds[i]}`) } };
        intervalFilter.push(filter);
      }
    }
    return { $or: intervalFilter };
  }
}
