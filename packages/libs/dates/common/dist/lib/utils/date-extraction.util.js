import { dateTime } from '../interfaces';
export function getSecondsSinceStartOfDay(d) {
    const date = d instanceof Date ? d : dateTime(d).toDate();
    return date.getSeconds() + 60 * (date.getMinutes() + 60 * date.getHours());
}
export function getIsoWeekOfYear(date) {
    return dateTime(date).isoWeek();
}
export function getQuarter(date) {
    return dateTime(date).quarter();
}
export function isCurrentYear(date) {
    return dateTime(date).year() === dateTime().year();
}
export function isToday(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return (date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear());
}
export function isThisYear(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return date.getFullYear() == today.getFullYear();
}
export function isThisMonth(cDate) {
    const today = new Date();
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    return date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear();
}
export function isInFuture(cDate, ignoreTime = false) {
    const date = cDate instanceof Date ? cDate : dateTime(cDate).toDate();
    const now = new Date();
    if (ignoreTime) {
        return (new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) >
            new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())));
    }
    return date > new Date();
}
//# sourceMappingURL=date-extraction.util.js.map