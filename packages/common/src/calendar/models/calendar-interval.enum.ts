export enum CalendarIntervalEnum {
  Unscheduled,
  Yearly,
  Quarterly,
  Monthly,
  Weekly,
  Daily,
}

export enum CalendarTimeInterval {
  Unscheduled,
  Yearly,
  Quarterly,
  Monthly,
  Weekly,
  Daily,
  Hourly,
  Minutely,
  Secondly,
  Millisecondly,
}

export function getCalendarIntervalArray(): CalendarIntervalEnum[] {
  return Object.keys(CalendarIntervalEnum)
    .filter((value) => isNaN(Number(value)) === false)
    .map((key) => parseInt(key))
    .reverse();
}
