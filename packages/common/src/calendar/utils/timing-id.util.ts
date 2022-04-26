import { CalendarDate, CalendarDateTime, dateTime } from "../interfaces";
import { CalendarIntervalEnum } from "../models";

export function toTimingId(cd: CalendarDateTime, level: CalendarIntervalEnum = CalendarIntervalEnum.Daily) {
    const dt = dateTime(cd);
    const d = dt.toDate();
    let result = `Y:${d.getUTCFullYear()}`;

    if(level <= CalendarIntervalEnum.Unscheduled) {
        return 'U';
    }

    if(level <= CalendarIntervalEnum.Yearly) {
        return result;
    }

    result += `;Q:${dt.quarter()}`;

    if(level <= CalendarIntervalEnum.Quarterly) {
        return result;
    }

    result += `;M:${d.getUTCMonth() + 1}`;

    if(level <= CalendarIntervalEnum.Monthly) {
        return result;
    }

    result += `;W:${dt.isoWeek()}`;

    if(level <= CalendarIntervalEnum.Weekly) {
        return result;
    }

    return result + `;D:${d.getUTCDate()}`;
}

export function getTimingIds(d: CalendarDateTime) {
    const dayId = toTimingId(d);
    const weekId = dayId.substring(0, dayId.lastIndexOf(';'));
    const monthId = weekId.substring(0, weekId.lastIndexOf(';'));
    const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
    const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));
    return ['U', yearId, quarterId, monthId, weekId, dayId];
}
