"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCalendarIntervalArray = exports.CalendarTimeInterval = exports.CalendarInterval = void 0;
var CalendarInterval;
(function (CalendarInterval) {
    CalendarInterval[CalendarInterval["Unscheduled"] = 0] = "Unscheduled";
    CalendarInterval[CalendarInterval["Yearly"] = 1] = "Yearly";
    CalendarInterval[CalendarInterval["Quarterly"] = 2] = "Quarterly";
    CalendarInterval[CalendarInterval["Monthly"] = 3] = "Monthly";
    CalendarInterval[CalendarInterval["Weekly"] = 4] = "Weekly";
    CalendarInterval[CalendarInterval["Daily"] = 5] = "Daily";
})(CalendarInterval = exports.CalendarInterval || (exports.CalendarInterval = {}));
var CalendarTimeInterval;
(function (CalendarTimeInterval) {
    CalendarTimeInterval[CalendarTimeInterval["Unscheduled"] = 0] = "Unscheduled";
    CalendarTimeInterval[CalendarTimeInterval["Yearly"] = 1] = "Yearly";
    CalendarTimeInterval[CalendarTimeInterval["Quarterly"] = 2] = "Quarterly";
    CalendarTimeInterval[CalendarTimeInterval["Monthly"] = 3] = "Monthly";
    CalendarTimeInterval[CalendarTimeInterval["Weekly"] = 4] = "Weekly";
    CalendarTimeInterval[CalendarTimeInterval["Daily"] = 5] = "Daily";
    CalendarTimeInterval[CalendarTimeInterval["Hourly"] = 6] = "Hourly";
    CalendarTimeInterval[CalendarTimeInterval["Minutely"] = 7] = "Minutely";
    CalendarTimeInterval[CalendarTimeInterval["Secondly"] = 8] = "Secondly";
    CalendarTimeInterval[CalendarTimeInterval["Millisecondly"] = 9] = "Millisecondly";
})(CalendarTimeInterval = exports.CalendarTimeInterval || (exports.CalendarTimeInterval = {}));
function getCalendarIntervalArray() {
    return Object.keys(CalendarInterval)
        .filter((value) => isNaN(Number(value)) === false)
        .map((key) => parseInt(key))
        .reverse();
}
exports.getCalendarIntervalArray = getCalendarIntervalArray;
