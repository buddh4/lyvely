import { CalendarInterval } from '@lyvely/common';
import { IDragEvent } from '@/modules/common';
import { IMoveEntryEvent } from '../interfaces';

export function getCalendarPlanOptions(): { value: CalendarInterval; label: string }[] {
  return [
    { value: CalendarInterval.Daily, label: 'calendar.interval.5' },
    { value: CalendarInterval.Weekly, label: 'calendar.interval.4' },
    { value: CalendarInterval.Monthly, label: 'calendar.interval.3' },
    { value: CalendarInterval.Quarterly, label: 'calendar.interval.2' },
    { value: CalendarInterval.Yearly, label: 'calendar.interval.1' },
    { value: CalendarInterval.Unscheduled, label: 'calendar.interval.0' },
  ];
}

export function dragEventToMoveEvent(evt: IDragEvent | IMoveEntryEvent): IMoveEntryEvent {
  return isMoveEntryEvent(evt)
    ? evt
    : {
        cid: <string>(
          (evt.item.dataset.cid || evt.item.querySelector<HTMLElement>('[data-cid]')?.dataset.cid)
        ),
        fromInterval: parseInt(evt.from.dataset.calendarInterval as string),
        toInterval: parseInt(evt.to.dataset.calendarInterval as string),
        newIndex: evt.newIndex,
        oldIndex: evt.oldIndex,
      };
}

function isMoveEntryEvent(evt: any): evt is IMoveEntryEvent {
  return evt.cid && evt.newIndex;
}
