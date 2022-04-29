import { CalendarDateTime, CalendarIntervalEnum } from "../../calendar";

export class DataPointIntervalFilter {
    constructor(public search: CalendarDateTime, public level: CalendarIntervalEnum = CalendarIntervalEnum.Unscheduled) {}
}
