import { CalendarDate } from '../interfaces';
import { getFullDayDate } from '../interfaces';
import { addDays } from '../utils';

export class DayIterator implements Iterable<Date> {

  private readonly currentDate: Date;
  private readonly toDate: Date;

  constructor(from: CalendarDate, to: CalendarDate) {
    this.currentDate = getFullDayDate(from);
    this.toDate = getFullDayDate(to);
  }

  [Symbol.iterator]() {
    let currentDate = this.currentDate;
    let toDate = this.toDate;

    return {
      next(): IteratorResult<Date> {
        if (currentDate <= toDate) {
          let result = {value: currentDate , done: false};
          currentDate = addDays(currentDate, 1);
          return result;
        }

        return {value: null, done: true};
      }
    }
  }
}