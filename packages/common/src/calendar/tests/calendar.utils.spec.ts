
import {
  buildTimingId,
  CalendarIntervalEnum,
  TimeSeriesRangeFilter,
  DayIterator,
  getFullDayDate,
  getTimingIdsByRange, getWeekOfYear
} from '../../index';

describe('CalendarUtils', () => {

  describe('getTimingIdsByRange', function () {
    it('simple date range filter', async () => {
      let filter = new TimeSeriesRangeFilter({
        from: '2021-04-03',
        to: '2021-04-04'
      });

      let result = getTimingIdsByRange(filter, 'en-US');
      expect(result).toContain("0:unscheduled");
      expect(result).toContain("1:Y:2021");
      expect(result).toContain("2:Y:2021:Q:2");
      expect(result).toContain("3:Y:2021:M:3");
      // Includes a week of year switch
      expect(result).toContain("4:Y:2021:W:14");
      expect(result).toContain("4:Y:2021:W:15");
      expect(result).toContain("5:Y:2021:M:3:D:3");
      expect(result).toContain("5:Y:2021:M:3:D:4");
    });

    it('simple include filter', async () => {
      let filter = new TimeSeriesRangeFilter({
        includes: ["5:Y:2021:M:3:D:3", "5:Y:2021:M:3:D:4"]
      });

      let result = getTimingIdsByRange(filter, 'en-US');

      expect(result.length).toEqual(2);
      expect(result).toContain("5:Y:2021:M:3:D:3");
      expect(result).toContain("5:Y:2021:M:3:D:4");
    });

    it('include with date range', async () => {
      let filter = new TimeSeriesRangeFilter({
        includes: ["5:Y:2021:M:3:D:3", "5:Y:2021:M:3:D:4"],
        from: '2021-04-03',
        to: '2021-04-04'
      });

      let result = getTimingIdsByRange(filter, 'en-US');

      expect(result.length).toEqual(2);
      expect(result).toContain("5:Y:2021:M:3:D:3");
      expect(result).toContain("5:Y:2021:M:3:D:4");
    });

    it('simple exclude filter', async () => {
      let filter = new TimeSeriesRangeFilter({
        excludes: ["5:Y:2021:M:3:D:3", "5:Y:2021:M:3:D:4"],
      });

      let result = getTimingIdsByRange(filter, 'en-US');
      expect(result.length).toEqual(0);
    });

    it('exclude with date range filter', async () => {
      let filter = new TimeSeriesRangeFilter({
        excludes: ["5:Y:2021:M:3:D:3", "5:Y:2021:M:3:D:4"],
        from: '2021-04-03',
        to: '2021-04-04'
      });

      let result = getTimingIdsByRange(filter, 'en-US');
      expect(result).toContain("0:unscheduled");
      expect(result).toContain("1:Y:2021");
      expect(result).toContain("2:Y:2021:Q:2");
      expect(result).toContain("3:Y:2021:M:3");
      // Includes a week of year switch
      expect(result).toContain("4:Y:2021:W:14");
      expect(result).toContain("4:Y:2021:W:15");
      expect(result).not.toContain("5:Y:2021:M:3:D:3");
      expect(result).not.toContain("5:Y:2021:M:3:D:4");
    });
  });

  describe('getFullDayDate', function () {
    it('from string with time without tz', async () => {
      let date = getFullDayDate('2021-03-01T12:00:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with time with utc tz', async () => {
      let date = getFullDayDate('2021-03-01T12:00:00Z');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string without time', async () => {
      let date = getFullDayDate('2021-03-01');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with min tz', async () => {
      let date = getFullDayDate('2021-03-01T15:00:00-11:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });

    it('from string with max tz', async () => {
      let date = getFullDayDate('2021-03-01T12:00:00+12:00');
      expect(date.toUTCString()).toEqual('Mon, 01 Mar 2021 00:00:00 GMT');
    });
  });

  describe('getWeekOfYear', function () {
    it('overlapping week ends in new year', async () => {
      let woy = getWeekOfYear('2021-01-01', 'de');
      expect(woy).toEqual(53);
    });

    it('monday first dow', async () => {
      let sunday = getWeekOfYear('2021-02-28',  'de');
      let monday = getWeekOfYear('2021-03-01',  'de');
      expect(sunday).toEqual(8);
      expect(monday).toEqual(9);
    });

    it('monday first dow', async () => {
      let sunday = getWeekOfYear('2021-02-28', 'en-US');
      let monday = getWeekOfYear('2021-03-01', 'en-US');
      expect(monday).toEqual(10);
      expect(sunday).toEqual(10);
    });
  });

  describe('buildTimingId', function () {
    describe('UnscheduledPlan', function () {
      it('first day of year', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Unscheduled, '2021-01-01', 'de');
        expect(timingId).toEqual('0:unscheduled');
      });
    });

    describe('YearlyPlan', function () {
      it('2021', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Yearly, '2021-01-01', 'de');
        expect(timingId).toEqual('1:Y:2021');
      });
    });

    describe('QuarterlyPlan', function () {

      it('Begin of first quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-01-01', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:1');
      });

      it('End of first quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-03-31', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:1');
      });

      it('Begin of second quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-04-01', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:2');
      });

      it('End of second quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-06-30', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:2');
      });

      it('Begin of third quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-07-01', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:3');
      });

      it('End of third quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-09-30', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:3');
      });

      it('Begin of fourth quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-10-01', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:4');
      });

      it('End of fourth quarter', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Quarterly, '2021-12-31', 'de');
        expect(timingId).toEqual('2:Y:2021:Q:4');
      });
    });

    describe('WeeklyPlan', function () {
      it('overlapping last week of year de', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Weekly, '2021-01-01', 'de');
        expect(timingId).toEqual('4:Y:2020:W:53');
      });

      it('first week of year en-US', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Weekly, '2021-01-01', 'en-US');
        expect(timingId).toEqual('4:Y:2021:W:1');
      });

      it('last day of 2021 de', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Weekly, '2021-12-31', 'de');
        expect(timingId).toEqual('4:Y:2021:W:52');
      });

      it('last day of 2021 en-US', async () => {
        let timingId = buildTimingId(CalendarIntervalEnum.Weekly, '2021-12-31', 'en-US');
        expect(timingId).toEqual('4:Y:2022:W:1');
      });
    });
  });

  describe('DayIterator', function () {
    it('iterate equal day', async () => {

      let iterator = new DayIterator('2021-01-01', '2021-01-01');
      let result = [];

      // @ts-ignore
      for(let date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(getFullDayDate('2021-01-01'));
    });

    it('iterate day with daylight saving', async () => {

      // Daylight saving at 28.03 2:00 am
      let iterator = new DayIterator('2021-03-24', '2021-03-31');
      let result = [];

      // @ts-ignore
      for(let date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(8);
      expect(result[0]).toEqual(getFullDayDate('2021-03-24'));
    });

    it('iterate equal two days', async () => {
      let iterator = new DayIterator('2021-01-01', '2021-01-02');
      let result = [];

      // @ts-ignore
      for(let date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(getFullDayDate('2021-01-01'));
      expect(result[1]).toEqual(getFullDayDate('2021-01-02'));
    });

    it('from > to', async () => {
      let iterator = new DayIterator('2021-01-02', '2021-01-01');
      let result = [];

      // @ts-ignore
      for(let date of iterator) {
        result.push(date);
      }

      expect(result.length).toEqual(0);
    });
  });
});