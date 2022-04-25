import { CalendarDateTime, CalendarIntervalEnum, dateTime } from "../../calendar";

export function toTimingId(cd: CalendarDateTime) {
    const dt = dateTime(cd);
    const d = dt.toDate();
    return `Y:${d.getUTCFullYear()};Q:${dt.quarter()};M:${d.getUTCMonth() + 1};W:${dt.isoWeek()};D:${d.getUTCDate()}`
}

export function getTimingLevelIds(d: CalendarDateTime) {
    const dayId = toTimingId(d);
    const weekId = dayId.substring(0, dayId.lastIndexOf(';'));
    const monthId = weekId.substring(0, weekId.lastIndexOf(';'));
    const quarterId = monthId.substring(0, monthId.lastIndexOf(';'));
    const yearId = quarterId.substring(0, quarterId.lastIndexOf(';'));

    return {
        [CalendarIntervalEnum.Daily]: dayId,
        [CalendarIntervalEnum.Weekly]: weekId,
        [CalendarIntervalEnum.Monthly]: monthId,
        [CalendarIntervalEnum.Quarterly]: quarterId,
        [CalendarIntervalEnum.Yearly]: yearId,
    }
}
