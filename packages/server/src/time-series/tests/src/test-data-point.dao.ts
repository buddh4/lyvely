import { AbstractDao, PartialEntityData, UpdateQuery } from '../../../db/abstract.dao';
import {
  getTimingLevelIds,
  TestNumberTimingDataPoint,
  TestNumberTimingDataPointDocument
} from './test-data-point.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { assureObjectId, EntityIdentity } from '../../../db/db.utils';
import { Profile } from '../../../profiles';
import {
  CalendarDateTime,
  CalendarIntervalEnum,
} from 'lyvely-common/src';
import { User } from '../../../users/schemas/users.schema';
import { Constructor } from 'lyvely-common';

export class TimingDataPointIntervalFilter {
  constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}
}

type InterValFilter = { 'meta.interval': CalendarIntervalEnum, tid?: string | { $regex: RegExp } };

@Injectable()
export class TestNumberDataPointDao extends AbstractDao<TestNumberTimingDataPoint> {

  @InjectModel(TestNumberTimingDataPoint.name)
  model: Model<TestNumberTimingDataPointDocument>;

  findByIntervalLevel(pid: EntityIdentity<Profile>, uid: EntityIdentity<User> | null, filter: TimingDataPointIntervalFilter) {
    return this.findAll({
      $and: [
        { pid: assureObjectId(pid) },
        {
          $or: [
            // TODO: Implement better visitor implementation
            { uid: uid ? assureObjectId(uid) : null },
            { uid: null }
          ]
        },
        this.buildTimingIntervalFilter(filter)
      ]
    });
  }

  protected async beforeUpdate(id: EntityIdentity<TestNumberTimingDataPoint>, update: UpdateQuery<TestNumberTimingDataPoint>): Promise<PartialEntityData<TestNumberTimingDataPoint> | boolean> {
    // Prevent updates of the following fields...
    // TODO: maybe solve through decorator or static getter
    delete update.date;
    delete update.tid;
    delete update['meta.pid'];
    delete update['meta.cid'];
    delete update['meta.uid'];
    return super.beforeUpdate(id, update);
  }

  private buildTimingIntervalFilter(filter: TimingDataPointIntervalFilter) {
    const timingIds = getTimingLevelIds(filter.search);
    const dailyFilter = { 'meta.interval': CalendarIntervalEnum.Daily, tid: timingIds[CalendarIntervalEnum.Daily] };

    if(filter.level === CalendarIntervalEnum.Daily ) {
      return dailyFilter;
    }

    const intervalFilter: InterValFilter[] = [ dailyFilter ];

    for(let i = CalendarIntervalEnum.Weekly;i >= 0;i--) {
      if(filter.level <= i) {
        const filter = i === CalendarIntervalEnum.Unscheduled
          ? { 'meta.interval': i }
          : { 'meta.interval': i, tid: { $regex: new RegExp(`^${timingIds[i] }`) } };
        intervalFilter.push(filter);
      }
    }

    return { $or: intervalFilter };
  }

  getModelConstructor(): Constructor<TestNumberTimingDataPoint> {
    return TestNumberTimingDataPoint;
  }

  getModuleId(): string {
    return 'test';
  }

}