import { getFullDayDate } from '../interfaces';
import { DayIterator } from './day.iterator';

describe('DayIterator', () => {
  describe('DayIterator', function () {
    it('iterate equal day', async () => {
      const iterator = new DayIterator('2021-01-01', '2021-01-01');
      const result = [];

      for (const date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(getFullDayDate('2021-01-01'));
    });

    it('iterate day with daylight saving', async () => {
      // Daylight saving at 28.03 2:00 am
      const iterator = new DayIterator('2021-03-24', '2021-03-31');
      const result = [];

      for (const date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(8);
      expect(result[0]).toEqual(getFullDayDate('2021-03-24'));
    });

    it('iterate equal two days', async () => {
      const iterator = new DayIterator('2021-01-01', '2021-01-02');
      const result = [];

      for (const date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(getFullDayDate('2021-01-01'));
      expect(result[1]).toEqual(getFullDayDate('2021-01-02'));
    });

    it('from > to', async () => {
      const iterator = new DayIterator('2021-01-02', '2021-01-01');
      const result = [];

      for (const date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(0);
    });
  });
});
