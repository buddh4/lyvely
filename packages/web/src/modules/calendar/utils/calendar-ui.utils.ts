import { CalendarIntervalEnum } from '@lyvely/common';

export function getCalendarPlanOptions(): { value: CalendarIntervalEnum; label: string }[] {
  return [
    { value: CalendarIntervalEnum.Daily, label: 'calendar.interval.5' },
    { value: CalendarIntervalEnum.Weekly, label: 'calendar.interval.4' },
    { value: CalendarIntervalEnum.Monthly, label: 'calendar.interval.3' },
    { value: CalendarIntervalEnum.Quarterly, label: 'calendar.interval.2' },
    { value: CalendarIntervalEnum.Yearly, label: 'calendar.interval.1' },
    { value: CalendarIntervalEnum.Unscheduled, label: 'calendar.interval.0' },
  ];
}
