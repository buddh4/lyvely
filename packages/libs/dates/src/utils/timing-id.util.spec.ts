import {
  getTimingIds,
  toTimingId,
  CalendarDateTime,
  CalendarInterval,
  ICalendarPreferences,
  useDayJsLocaleManager,
} from '../index';

describe('time series utils', () => {
  beforeEach(async () => {
    await useDayJsLocaleManager().loadLocale('de');
    await useDayJsLocaleManager().loadLocale('en');
  });

  describe('getTimingIds', () => {
    it('get calendar ids', () => {
      const date = new Date('2022-02-20');
      const tIds = getTimingIds(date, 'de');
      expect(tIds[CalendarInterval.Unscheduled]).toEqual('U');
      expect(tIds[CalendarInterval.Yearly]).toEqual('Y:2022');
      expect(tIds[CalendarInterval.Quarterly]).toEqual('Y:2022;Q:1');
      expect(tIds[CalendarInterval.Monthly]).toEqual('Y:2022;Q:1;M:02');
      expect(tIds[CalendarInterval.Weekly]).toEqual('Y:2022;Q:1;M:02;W:07');
      expect(tIds[CalendarInterval.Daily]).toEqual('Y:2022;Q:1;M:02;D:20');
    });
  });

  function expectTid(
    date: CalendarDateTime,
    interval: CalendarInterval,
    expected: string,
    locale = 'de',
    preferences?: ICalendarPreferences,
  ) {
    expect(toTimingId(date, interval, locale, preferences)).toEqual(expected);
  }

  function expectWeeklyENTid(date: CalendarDateTime, expected: string) {
    expectTid(date, CalendarInterval.Weekly, expected, 'en');
  }

  function expectWeeklyDETid(date: CalendarDateTime, expected: string) {
    expectTid(date, CalendarInterval.Weekly, expected, 'de');
  }

  function expectWeeklyIsoTid(date: CalendarDateTime, expected: string) {
    // yearStart: 0 === iso
    expectTid(date, CalendarInterval.Weekly, expected, 'de', { yearStart: 0 });
  }

  describe('toTimingId', () => {
    describe('unscheduled level', function () {
      it('simple unscheduled level', async () => {
        expectTid('2022-02-20', CalendarInterval.Unscheduled, 'U');
      });
    });

    describe('year level', function () {
      it('simple year level', () => {
        expectTid('2022-02-20', CalendarInterval.Yearly, 'Y:2022');
      });

      it('first day of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarInterval.Yearly);
        expect(timingId).toEqual('Y:2021');
      });
    });

    describe('month level', function () {
      it('simple month level', () => {
        expectTid('2022-02-20', CalendarInterval.Monthly, 'Y:2022;Q:1;M:02');
      });
    });

    describe('quarter level', function () {
      it('simple quarter level', () => {
        expectTid('2022-02-20', CalendarInterval.Quarterly, 'Y:2022;Q:1');
      });

      it('Begin of first quarter', async () => {
        const timingId = toTimingId('2021-01-01', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:1');
      });

      it('End of first quarter', async () => {
        const timingId = toTimingId('2021-03-31', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:1');
      });

      it('Begin of second quarter', async () => {
        const timingId = toTimingId('2021-04-01', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:2');
      });

      it('End of second quarter', async () => {
        const timingId = toTimingId('2021-06-30', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:2');
      });

      it('Begin of third quarter', async () => {
        const timingId = toTimingId('2021-07-01', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:3');
      });

      it('End of third quarter', async () => {
        const timingId = toTimingId('2021-09-30', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:3');
      });

      it('Begin of fourth quarter', async () => {
        const timingId = toTimingId('2021-10-01', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:4');
      });

      it('End of fourth quarter', async () => {
        const timingId = toTimingId('2021-12-31', CalendarInterval.Quarterly);
        expect(timingId).toEqual('Y:2021;Q:4');
      });
    });

    describe('week level', function () {
      it('simple week level', () => {
        expectTid('2022-02-20', CalendarInterval.Weekly, 'Y:2022;Q:1;M:02;W:07');
      });

      it('overlapping last week of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarInterval.Weekly, 'de', { yearStart: 0 });
        expect(timingId).toEqual('Y:2020;Q:4;M:12;W:53');
      });

      it('last day of 2021 yearStart = 1', async () => {
        const timingId = toTimingId('2021-12-31', CalendarInterval.Weekly);
        expect(timingId).toEqual('Y:2022;Q:1;M:01;W:01');
      });

      it('last day of 2021 yearStart = 4', async () => {
        const timingId = toTimingId('2021-12-31', CalendarInterval.Weekly, 'en', { yearStart: 4 });
        expect(timingId).toEqual('Y:2021;Q:4;M:12;W:52');
      });

      it('en locale year edge cases', () => {
        expectWeeklyENTid('1982-01-03', 'Y:1982;Q:1;M:01;W:02');
        expectWeeklyENTid('1982-01-02', 'Y:1982;Q:1;M:01;W:01');
        expectWeeklyENTid('1981-12-31', 'Y:1982;Q:1;M:01;W:01');
        expectWeeklyENTid('1981-01-01', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyENTid('1980-12-31', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyENTid('1980-12-30', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyENTid('1980-12-29', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyENTid('1980-12-28', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyENTid('1980-01-01', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyENTid('1979-12-31', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyENTid('1979-12-30', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyENTid('1979-01-01', 'Y:1979;Q:1;M:01;W:01');
        expectWeeklyENTid('1978-12-31', 'Y:1979;Q:1;M:01;W:01');
        expectWeeklyENTid('1978-01-02', 'Y:1978;Q:1;M:01;W:01');
        expectWeeklyENTid('1978-01-01', 'Y:1978;Q:1;M:01;W:01');
        expectWeeklyENTid('1977-12-31', 'Y:1977;Q:4;M:12;W:53');
        expectWeeklyENTid('1977-01-02', 'Y:1977;Q:1;M:01;W:02');
        expectWeeklyENTid('1977-01-01', 'Y:1977;Q:1;M:01;W:01');
      });

      it('de locale year edge cases', () => {
        expectWeeklyDETid('1982-01-03', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyDETid('1982-01-02', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyDETid('1981-12-31', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyDETid('1981-01-01', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyDETid('1980-12-31', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyDETid('1980-12-30', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyDETid('1980-12-29', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyDETid('1980-12-28', 'Y:1980;Q:4;M:12;W:52');
        expectWeeklyDETid('1980-01-01', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyDETid('1979-12-31', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyDETid('1979-12-30', 'Y:1979;Q:4;M:12;W:52');
        expectWeeklyDETid('1979-01-01', 'Y:1979;Q:1;M:01;W:01');
        expectWeeklyDETid('1978-12-31', 'Y:1978;Q:4;M:12;W:52');
        expectWeeklyDETid('1978-01-02', 'Y:1978;Q:1;M:01;W:01');
        expectWeeklyDETid('1978-01-01', 'Y:1977;Q:4;M:12;W:52');
        expectWeeklyDETid('1977-12-31', 'Y:1977;Q:4;M:12;W:52');
        expectWeeklyDETid('1977-01-03', 'Y:1977;Q:1;M:01;W:01');
        expectWeeklyDETid('1977-01-02', 'Y:1976;Q:4;M:12;W:53');
        expectWeeklyDETid('1977-01-01', 'Y:1976;Q:4;M:12;W:53');
      });

      it('iso edge year cases', () => {
        expectWeeklyIsoTid('1982-01-03', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyIsoTid('1982-01-02', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyIsoTid('1981-12-31', 'Y:1981;Q:4;M:12;W:53');
        expectWeeklyIsoTid('1981-01-01', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1980-12-31', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1980-12-30', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1980-12-29', 'Y:1981;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1980-12-28', 'Y:1980;Q:4;M:12;W:52');
        expectWeeklyIsoTid('1980-01-01', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1979-12-31', 'Y:1980;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1979-12-30', 'Y:1979;Q:4;M:12;W:52');
        expectWeeklyIsoTid('1979-01-01', 'Y:1979;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1978-12-31', 'Y:1978;Q:4;M:12;W:52');
        expectWeeklyIsoTid('1978-01-02', 'Y:1978;Q:1;M:01;W:01');
        expectWeeklyIsoTid('1978-01-01', 'Y:1977;Q:4;M:12;W:52');
        expectWeeklyIsoTid('1977-12-31', 'Y:1977;Q:4;M:12;W:52');
        expectWeeklyIsoTid('1977-01-02', 'Y:1976;Q:4;M:12;W:53');
        expectWeeklyIsoTid('1977-01-01', 'Y:1976;Q:4;M:12;W:53');
      });

      it('iso month edge cases', () => {
        expectWeeklyIsoTid('2023-03-31', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyIsoTid('2023-04-01', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyIsoTid('2023-04-02', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyIsoTid('2023-04-03', 'Y:2023;Q:2;M:04;W:14');
        expectWeeklyIsoTid('2022-07-31', 'Y:2022;Q:3;M:07;W:30');
        expectWeeklyIsoTid('2022-08-01', 'Y:2022;Q:3;M:08;W:31');
      });

      it('locale de month edge cases', () => {
        expectWeeklyDETid('2023-03-31', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyDETid('2023-04-01', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyDETid('2023-04-02', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyDETid('2023-04-03', 'Y:2023;Q:2;M:04;W:14');
        expectWeeklyDETid('2022-07-31', 'Y:2022;Q:3;M:07;W:30');
        expectWeeklyDETid('2022-08-01', 'Y:2022;Q:3;M:08;W:31');
      });

      it('locale en month edge cases', () => {
        expectWeeklyENTid('2023-03-31', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyENTid('2023-04-01', 'Y:2023;Q:1;M:03;W:13');
        expectWeeklyENTid('2023-04-02', 'Y:2023;Q:2;M:04;W:14');
        expectWeeklyENTid('2023-04-03', 'Y:2023;Q:2;M:04;W:14');
        expectWeeklyENTid('2022-07-31', 'Y:2022;Q:3;M:07;W:32');
        expectWeeklyENTid('2022-08-01', 'Y:2022;Q:3;M:07;W:32');
      });
    });

    describe('day level', function () {
      it('without explicit level', () => {
        expect(toTimingId('2022-02-20')).toEqual('Y:2022;Q:1;M:02;D:20');
      });

      it('overlapping last week of year', async () => {
        const timingId = toTimingId('2021-01-01', CalendarInterval.Daily);
        expect(timingId).toEqual('Y:2021;Q:1;M:01;D:01');
      });

      it('last day of 2021', async () => {
        const timingId = toTimingId('2021-12-31', CalendarInterval.Daily);
        expect(timingId).toEqual('Y:2021;Q:4;M:12;D:31');
      });
    });
  });
});
