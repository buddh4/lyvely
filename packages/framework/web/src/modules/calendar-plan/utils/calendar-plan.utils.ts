import { CalendarInterval } from '@lyvely/dates';
import { IDragEvent } from '@/modules/common';
import { IMoveEntryEvent } from '../interfaces';

export function getCalendarPlanOptions(
  mode: 'recurrent' | 'plural' = 'recurrent',
): { value: CalendarInterval; label: string }[] {
  return [
    { value: CalendarInterval.Daily, label: `calendar-plan.interval.${mode}.5` },
    { value: CalendarInterval.Weekly, label: `calendar-plan.interval.${mode}.4` },
    { value: CalendarInterval.Monthly, label: `calendar-plan.interval.${mode}.3` },
    { value: CalendarInterval.Quarterly, label: `calendar-plan.interval.${mode}.2` },
    { value: CalendarInterval.Yearly, label: `calendar-plan.interval.${mode}.1` },
    { value: CalendarInterval.Unscheduled, label: `calendar-plan.interval.${mode}.0` },
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
