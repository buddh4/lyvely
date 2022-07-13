import { AbstractDao } from "../../db/abstract.dao";
import { assureObjectId, EntityIdentity } from "../../db/db.utils";
import { Profile } from "../../profiles";
import { User } from "../../users";
import { DataPoint, TimeSeriesContent } from "../schemas";
import { CalendarDate, getTimingIds, toTimingId, DataPointIntervalFilter, CalendarIntervalEnum } from "lyvely-common";

type InterValFilter = { 'meta.interval': CalendarIntervalEnum, tid?: string | { $regex: RegExp } };

export abstract class DataPointDao<T extends DataPoint<any>> extends AbstractDao<T> {

  // TODO: Implement update interval of data points

  abstract updateDataPointValue(uid: EntityIdentity<User>, dataPoint: T, newValue: any): Promise<boolean>;

  async findDataPointByDate(cid: EntityIdentity<TimeSeriesContent>, date: CalendarDate) {
    return this.findOne({
      'meta.cid': assureObjectId(cid),
      tid: toTimingId(date),
    })
  }

  async findUserDataPointByDate(cid: EntityIdentity<TimeSeriesContent>, uid: EntityIdentity<User>, date: CalendarDate) {
    return this.findOne({
      'meta.cid': assureObjectId(cid),
      'meta.uid': assureObjectId(uid),
      tid: toTimingId(date),
    })
  }

  async findByIntervalLevel(pid: EntityIdentity<Profile>, uid: EntityIdentity<User> | null, filter: DataPointIntervalFilter) {
    // If no uid is given we assume visitor role
    const uidFilter = uid
      ? {
          $or: [
            { 'meta.uid': assureObjectId(uid) },
            { 'meta.uid': null }
          ]
      }
      : { 'meta.uid': null };

    return this.findAll({
      $and: [
        { pid: assureObjectId(pid) },
        uidFilter,
        this.buildTimingIntervalFilter(filter)
      ]
    });
  }

  private buildTimingIntervalFilter(filter: DataPointIntervalFilter) {
    const timingIds = getTimingIds(filter.search);
    const dailyFilter = { 'meta.interval': CalendarIntervalEnum.Daily, tid: timingIds[CalendarIntervalEnum.Daily] };

    if (filter.level === CalendarIntervalEnum.Daily) {
      return dailyFilter;
    }

    const intervalFilter: InterValFilter[] = [dailyFilter];

    for (let i = CalendarIntervalEnum.Weekly; i >= 0; i--) {
      if (filter.level <= i) {
        const filter = i === CalendarIntervalEnum.Unscheduled
          ? { 'meta.interval': i }
          : { 'meta.interval': i, tid: { $regex: new RegExp(`^${timingIds[i]}`) } };
        intervalFilter.push(filter);
      }
    }

    return { $or: intervalFilter };
  }
}
