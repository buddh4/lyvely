import {
  CalendarIntervalEnum,
  DayIterator,
  getFullDayDate,
  getRelativeTime,
  getWeekOfYear,
  toTimingId,
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

  describe('getWeekOfYear', function () {
    it('overlapping week ends in new year', async () => {
      const woy = getWeekOfYear('2021-01-01', 'de');
      expect(woy).toEqual(53);
    });

    it('monday first dow', async () => {
      const sunday = getWeekOfYear('2021-02-28', 'de');
      const monday = getWeekOfYear('2021-03-01', 'de');
      expect(sunday).toEqual(8);
      expect(monday).toEqual(9);
    });

    it('monday first dow', async () => {
      const sunday = getWeekOfYear('2021-02-28', 'en-US');
      const monday = getWeekOfYear('2021-03-01', 'en-US');
      expect(monday).toEqual(10);
      expect(sunday).toEqual(10);
    });
  });

  describe('toTimingId', function () {
    describe('UnscheduledPlan', function () {
      it('first day of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarIntervalEnum.Unscheduled);
        expect(timingId).toEqual('U');
      });
    });

    describe('YearlyPlan', function () {
      it('2021', async () => {
        const timingId = toTimingId('2021-01-01', CalendarIntervalEnum.Yearly);
        expect(timingId).toEqual('Y:2021');
      });
    });

    describe('QuarterlyPlan', function () {
      it('Begin of first quarter', async () => {
        const timingId = toTimingId('2021-01-01', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:1');
      });

      it('End of first quarter', async () => {
        const timingId = toTimingId('2021-03-31', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:1');
      });

      it('Begin of second quarter', async () => {
        const timingId = toTimingId('2021-04-01', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:2');
      });

      it('End of second quarter', async () => {
        const timingId = toTimingId('2021-06-30', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:2');
      });

      it('Begin of third quarter', async () => {
        const timingId = toTimingId('2021-07-01', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:3');
      });

      it('End of third quarter', async () => {
        const timingId = toTimingId('2021-09-30', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:3');
      });

      it('Begin of fourth quarter', async () => {
        const timingId = toTimingId('2021-10-01', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:4');
      });

      it('End of fourth quarter', async () => {
        const timingId = toTimingId('2021-12-31', CalendarIntervalEnum.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:4');
      });
    });

    describe('WeeklyPlan', function () {
      it('overlapping last week of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarIntervalEnum.Weekly);
        expect(timingId).toEqual('Y:2021;Q:1;M:1;W:53');
      });

      it('last day of 2021', async () => {
        const timingId = toTimingId('2021-12-31', CalendarIntervalEnum.Weekly);
        expect(timingId).toEqual('Y:2021;Q:4;M:12;W:52');
      });
    });

    describe('Daily', function () {
      it('overlapping last week of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarIntervalEnum.Daily);
        expect(timingId).toEqual('Y:2021;Q:1;M:1;W:53;D:1');
      });

      it('last day of 2021', async () => {
        const timingId = toTimingId('2021-12-31', CalendarIntervalEnum.Daily);
        expect(timingId).toEqual('Y:2021;Q:4;M:12;W:52;D:31');
      });
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
