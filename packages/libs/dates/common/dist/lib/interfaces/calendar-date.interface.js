export function implementsIDateTime(obj) {
    return obj && obj.isDateTime === true;
}
export function toDate(date) {
    return dateTime(date).toDate();
}
let dateTimeFactory;
export function setDateTimeFactory(factory) {
    dateTimeFactory = factory;
}
export function dateTime(date, utc = false, locale, timezone) {
    if (!dateTimeFactory) {
        throw new Error('No dateTimeFactory set');
    }
    if (implementsIDateTime(date))
        return date;
    if (typeof date === 'string' && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(date)) {
        date = getFullDayDate(date);
    }
    return dateTimeFactory(date, utc, locale, timezone);
}
export function getFullDayDate(date) {
    if (typeof date === 'string') {
        const dateNoTime = date.split('T')[0];
        if (/^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(dateNoTime)) {
            const splitDate = dateNoTime.split('-');
            date = new Date(Date.UTC(parseInt(splitDate[0]), parseInt(splitDate[1]) - 1, parseInt(splitDate[2])));
        }
        else {
            date = new Date(date);
        }
    }
    else if (date instanceof Date) {
        date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    }
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}
//# sourceMappingURL=calendar-date.interface.js.map