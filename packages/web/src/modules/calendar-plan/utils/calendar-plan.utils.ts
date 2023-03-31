import {
  CalendarIntervalEnum,
  DataPointValueType,
  IDataPointConfig,
  INumberDataPointConfig,
  ITextDataPointConfig,
} from '@lyvely/common';
import { IDragEvent } from '@/modules/common';
import { IMoveEntryEvent } from '@/modules/calendar-plan';

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

export function dragEventToMoveEvent(evt: IDragEvent | IMoveEntryEvent): IMoveEntryEvent {
  return isMoveEntryEvent(evt)
    ? evt
    : {
        cid: evt.item.dataset.cid as string,
        fromInterval: parseInt(evt.from.dataset.calendarInterval as string),
        toInterval: parseInt(evt.to.dataset.calendarInterval as string),
        newIndex: evt.newIndex,
        oldIndex: evt.oldIndex,
      };
}

export function getDataPointValueColor(config: IDataPointConfig, value: any) {
  if (isNumberDataPointConfig(config)) {
    if (config.min && value <= config.min) return 'warning';
    if (config.optimal && value >= config.optimal!) return 'success';
    if (value) return 'success';
  } else if (isTextDataPointConfig(config)) {
    if (config.required && !value) return 'warning';
    // We do not need any other indication here
  }
  return '';
}

export function isNumberDataPointConfig(
  config: IDataPointConfig,
): config is INumberDataPointConfig {
  return config.valueType === DataPointValueType.Number;
}

export function isTextDataPointConfig(config: IDataPointConfig): config is ITextDataPointConfig {
  return config.valueType === DataPointValueType.Text;
}

function isMoveEntryEvent(evt: any): evt is IMoveEntryEvent {
  return evt.cid && evt.newIndex;
}
