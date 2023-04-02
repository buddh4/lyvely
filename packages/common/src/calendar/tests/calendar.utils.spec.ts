import {
  CalendarIntervalEnum,
  DayIterator,
  getFullDayDate,
  getRelativeTime,
  toTimingId,
  WeekStrategy,
} from '@/calendar';

describe('CalendarUtils', () => {
  describe('getFullDayDate', function () {
    it('from string with time without tz', async () => {
      const date = getFullDayDate('2021-03-01T12:00:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with time with utc tz', async () => {
      const date = getFullDayDate('2021-03-01T12:00:00Z');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string without time', async () => {
      const date = getFullDayDate('2021-03-01');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with min tz', async () => {
      const date = getFullDayDate('2021-03-01T15:00:00-11:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with max tz', async () => {
      const date = getFullDayDate('2021-03-01T12:00:00+12:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });
  });

  describe('getRelativeTime', function () {
    it('one second ago', () => {
      expect(getRelativeTime(-1000, 'en')).toEqual('1 second ago');
    });

    it('get less than minute ago', () => {
      expect(getRelativeTime(-(5 * 1000), 'en')).toEqual('5 seconds ago');
    });

    it('59 second ago', () => {
      expect(getRelativeTime(-(59 * 1000), 'en')).toEqual('59 seconds ago');
    });

    it('one minute ago', () => {
      expect(getRelativeTime(-(1000 * 60), 'en')).toEqual('1 minute ago');
    });

    it('get less than hour ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60), 'en')).toEqual('5 minutes ago');
    });

    it('59 minutes ago', () => {
      expect(getRelativeTime(-(59 * 1000 * 60), 'en')).toEqual('59 minutes ago');
    });

    it('1 hour ago', () => {
      expect(getRelativeTime(-(1000 * 60 * 60), 'en')).toEqual('1 hour ago');
    });

    it('get less than day ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60 * 60), 'en')).toEqual('5 hours ago');
    });

    it('23 hours ago', () => {
      expect(getRelativeTime(-(23 * 1000 * 60 * 60), 'en')).toEqual('23 hours ago');
    });

    it('1 day ago', () => {
      expect(getRelativeTime(-(1 * 1000 * 60 * 60 * 24), 'en')).toEqual('1 day ago');
    });

    it('get less than week ago', () => {
      expect(getRelativeTime(-(5 * 1000 * 60 * 60 * 24), 'en')).toEqual('5 days ago');
    });

    it('6 days ago', () => {
      expect(getRelativeTime(-(6 * 1000 * 60 * 60 * 24), 'en')).toEqual('6 days ago');
    });

    it('1 week ago', () => {
      expect(getRelativeTime(-(1 * 1000 * 60 * 60 * 24 * 7), 'en')).toEqual('1 week ago');
    });

    it('get less than year ago', () => {
      expect(getRelativeTime(-(2 * 1000 * 60 * 60 * 24 * 30), 'en')).toEqual('2 months ago');
    });

    it('more than a year ago', () => {
      expect(getRelativeTime(-(1 * 1000 * 60 * 60 * 24 * 366), 'en')).toEqual('1 year ago');
    });
  });

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
