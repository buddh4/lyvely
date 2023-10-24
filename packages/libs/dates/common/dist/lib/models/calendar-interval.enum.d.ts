export declare enum CalendarInterval {
    Unscheduled = 0,
    Yearly = 1,
    Quarterly = 2,
    Monthly = 3,
    Weekly = 4,
    Daily = 5
}
export declare enum CalendarTimeInterval {
    Unscheduled = 0,
    Yearly = 1,
    Quarterly = 2,
    Monthly = 3,
    Weekly = 4,
    Daily = 5,
    Hourly = 6,
    Minutely = 7,
    Secondly = 8,
    Millisecondly = 9
}
export declare function getCalendarIntervalArray(): CalendarInterval[];
