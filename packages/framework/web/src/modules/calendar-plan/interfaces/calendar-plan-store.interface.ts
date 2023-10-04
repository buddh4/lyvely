import { CalendarInterval } from '@lyvely/common';

export interface IMoveEntryEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarInterval;
  toInterval: CalendarInterval;
}
