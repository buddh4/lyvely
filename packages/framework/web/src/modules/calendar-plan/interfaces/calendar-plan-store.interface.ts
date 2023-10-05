import { CalendarInterval } from '@lyvely/dates';

export interface IMoveEntryEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarInterval;
  toInterval: CalendarInterval;
}
