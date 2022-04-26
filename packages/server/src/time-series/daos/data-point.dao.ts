import { CalendarDateTime, CalendarIntervalEnum } from "lyvely-common/src";
import { AbstractDao, PartialEntityData, UpdateQuery } from "../../db/abstract.dao";
import { assureObjectId, EntityIdentity } from "../../db/db.utils";
import { Profile } from "../../profiles";
import { User } from "../../users";
import { Injectable } from '@nestjs/common';
import { DataPoint, TimeSeriesContent } from "../schemas";
import { CalendarDate, getTimingIds, toTimingId } from "lyvely-common";

export class DataPointIntervalFilter {
    constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}

    getTid() {
        return toTimingId(this.search);
    }
}

type InterValFilter = { 'meta.interval': CalendarIntervalEnum, tid?: string | { $regex: RegExp } };

@Injectable()
export abstract class DataPointDao<T extends DataPoint<any>> extends AbstractDao<T> {

    async findLogByDate(cid: EntityIdentity<TimeSeriesContent>, date: CalendarDate) {
        return this.findOne({
            'meta.cid': assureObjectId(cid),
            tid: toTimingId(date),
        })
    }

    async findByIntervalLevel(pid: EntityIdentity<Profile>, uid: EntityIdentity<User> | null, filter: DataPointIntervalFilter) {
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

    private buildTimingIntervalFilter(filter: DataPointIntervalFilter) {
        const timingIds = getTimingIds(filter.search);
        const dailyFilter = { 'meta.interval': CalendarIntervalEnum.Daily, tid: timingIds[CalendarIntervalEnum.Daily] };

        if(filter.level === CalendarIntervalEnum.Daily ) {
            return dailyFilter;
        }

        const intervalFilter: InterValFilter[] = [ dailyFilter ];

        for(let i = CalendarIntervalEnum.Weekly;i >= 0;i--) {
            if(filter.level <= i) {
                const filter = i === CalendarIntervalEnum.Unscheduled
                    ? { 'meta.interval': i }
                    : { 'meta.interval': i, tid: { $regex: new RegExp(`^${timingIds[i]}`) } };
                intervalFilter.push(filter);
            }
        }

        return { $or: intervalFilter };
    }

    protected async beforeUpdate(id: EntityIdentity<T>, update: UpdateQuery<T>): Promise<PartialEntityData<T> | boolean> {
        // Prevent updates of the following fields...
        // TODO: maybe solve through decorator or static getter
        delete update.date;
        delete update.tid;
        delete update['meta.pid'];
        delete update['meta.cid'];
        delete update['meta.uid'];
        return super.beforeUpdate(id, update);
    }
}
