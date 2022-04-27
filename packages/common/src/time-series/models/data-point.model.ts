import { CalendarDateTime, CalendarIntervalEnum, toTimingId } from "../../calendar";

export class DataPointIntervalFilter {
    constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}

    getTid() {
        return toTimingId(this.search);
    }
}
