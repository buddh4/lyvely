export enum CalendarInterval {
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

export function getCalendarIntervalArray(): CalendarInterval[] {
  return Object.keys(CalendarInterval)
    .filter((value) => isNaN(Number(value)) === false)
    .map((key) => parseInt(key))
    .reverse();
}
