import { User, Profile, AbstractDao, assureObjectId, DocumentIdentity } from '@lyvely/api';
import { buildDiscriminatorName, DataPoint, TimeSeriesContent } from '../schemas';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import { getTimingIds, CalendarInterval } from '@lyvely/dates';
import type { BaseDocument } from '@lyvely/api';
import type { IDataPointDaoMeta } from './data-point-dao-meta.interface';
type InterValFilter = { interval: CalendarInterval; tid?: string | { $regex: RegExp } };

/**
 * Represents an abstract class for a Data Point Dao.
 *
 * @template T - The type of the Data Point.
 * @template TVersions - The type of the Base Document.
 * @template TMeta - The type of the Data Point Dao Meta.
 */
export abstract class AbstractDataPointDao<
  T extends DataPoint = DataPoint,
  TVersions extends BaseDocument = T,
  TMeta extends IDataPointDaoMeta<T> = IDataPointDaoMeta<T>,
> extends AbstractDao<T, TVersions, TMeta> {
  /**
   * Update the value of a data point for a given user.
   *
   * @param {DocumentIdentity<User>} uid - The identifier of the user.
   * @param {T} dataPoint - The data point to update.
   * @param {T['value']} value - The new value for the data point.
   *
   * @returns {Promise<any>} - A Promise that resolves when the data point value is updated.
   */
  async updateDataPointValue(uid: DocumentIdentity<User>, dataPoint: T, value: T['value']) {
    return await this.updateOneSetById(
      dataPoint as DocumentIdentity<T>,
      {
        valueType: dataPoint.valueType,
        value,
      },
      {
        discriminator: buildDiscriminatorName(
          this.getMetaData().content.name,
          dataPoint.constructor.name
        ),
      }
    );
  }

  /**
   * Finds a data point by its tid (timing ID) within the given content.
   *
   * @param {TimeSeriesContent} content - The time series content to search within.
   * @param {string} tid - The time series ID of the data point to find.
   * @returns {Promise<DataPoint>} - A promise that resolves to the found data point or undefined if not found.
   */
  async findDataPointByTid(content: TimeSeriesContent, tid: string) {
    // TODO: (TimeSeries History) fetch interval from history
    return this.findOne({
      cid: assureObjectId(content),
      tid,
    });
  }

  /**
   * Finds a data point by its tid (timing ID) for a specific user.
   *
   * @param {TimeSeriesContent} content - The TimeSeriesContent object used to identify the TimeSeries.
   * @param {DocumentIdentity<User>} uid - The unique identifier of the user.
   * @param {string} tid - The identifier of the specific data point to find.
   *
   * @return {Promise<DataPoint>} - A Promise that resolves to the found data point.
   */
  async findUserDataPointByTid(
    content: TimeSeriesContent,
    uid: DocumentIdentity<User>,
    tid: string
  ) {
    // TODO: (TimeSeries History) fetch interval from history
    return this.findOne({
      cid: assureObjectId(content),
      uid: assureObjectId(uid),
      tid,
    });
  }

  /**
   * Finds all data point of a profile filtered by a data point interval filter.
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
    uid: DocumentIdentity<User> | null | undefined,
    filter: CalendarPlanFilter
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

  /**
   * Builds a timing interval filter based on the provided profile and filter.
   *
   * @param {Profile} profile - The profile object.
   * @param {CalendarPlanFilter} filter - The filter object.
   * @private
   * @returns {object} - The timing interval filter.
   */
  private buildTimingIntervalFilter(profile: Profile, filter: CalendarPlanFilter) {
    const timingIds = getTimingIds(
      filter.date,
      profile.locale,
      profile.settings?.calendar,
      filter.level
    );

    return { tid: { $in: timingIds } };
  }

  /**
   * This was intended to be able to load data points for time series which changed tid.
   * Since we use the history in the frontend, we do not need this for usual use-cases but maybe in the future.
   *
   * @param profile
   * @param filter
   * @private
   */
  private buildTimingRegexIntervalFilter(profile: Profile, filter: CalendarPlanFilter) {
    const timingIds = getTimingIds(filter.date, profile.locale, profile.settings?.calendar);
    const dailyFilter = {
      interval: CalendarInterval.Daily,
      tid: timingIds[CalendarInterval.Daily],
    };

    if (filter.level === CalendarInterval.Daily) {
      return dailyFilter;
    }

    const intervalFilter: InterValFilter[] = [dailyFilter];

    for (let i = CalendarInterval.Weekly; i >= 0; i--) {
      if (filter.level <= i) {
        const filter =
          i === CalendarInterval.Unscheduled
            ? { interval: i }
            : { interval: i, tid: { $regex: new RegExp(`^${timingIds[i]}`) } };
        intervalFilter.push(filter);
      }
    }
    return { $or: intervalFilter };
  }
}
