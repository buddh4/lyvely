import { CalendarIntervalEnum } from '@lyvely/common';

export interface IMoveEntryEvent {
  cid: string;
  newIndex: number;
  oldIndex: number;
  fromInterval: CalendarIntervalEnum;
  toInterval: CalendarIntervalEnum;
}
