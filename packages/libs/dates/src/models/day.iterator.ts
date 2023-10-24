import { CalendarDate, getFullDayDate } from '../interfaces';
import { addDays } from '../utils/date-calculation.util';

export class DayIterator implements Iterable<Date> {
  private readonly currentDate: Date;
  private readonly toDate: Date;

  constructor(from: CalendarDate, to: CalendarDate) {
    this.currentDate = getFullDayDate(from);
    this.toDate = getFullDayDate(to);
  }

  [Symbol.iterator]() {
    let currentDate = this.currentDate;
    const toDate = this.toDate;

    return {
      next(): IteratorResult<Date> {
        if (currentDate <= toDate) {
          const result = { value: currentDate, done: false };
          currentDate = addDays(currentDate, 1);
          return result;
        }

        return { value: null, done: true };
      },
    };
  }
}
