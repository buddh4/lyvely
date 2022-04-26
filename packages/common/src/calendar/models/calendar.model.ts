import { CalendarIntervalEnum } from './calendar-interval.enum';
import { CalendarDate } from '../interfaces';
import { CalendarPlan } from './calendar-plan.model';

/**
 * Helper class for calendar related objects
 */
export class Calendar {
  static getTimeableCalendarPlanInstance(interval: CalendarIntervalEnum) {
    return CalendarPlan.getInstance(interval);
  }

  static createTiming(interval: CalendarIntervalEnum, date: CalendarDate) {
    return CalendarPlan.getInstance(interval).createTimingInstance(date);
  }
}
