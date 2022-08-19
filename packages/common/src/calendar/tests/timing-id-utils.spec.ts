import { CalendarIntervalEnum, getTimingIds, toTimingId } from "../models";

describe('time series utils', () => {
  describe('getTimingIds', () => {
    it('get calendar ids', () => {
      const date = new Date('2022-02-20');
      const tIds = getTimingIds(date);
      expect(tIds[CalendarIntervalEnum.Unscheduled]).toEqual('U');
      expect(tIds[CalendarIntervalEnum.Yearly]).toEqual('Y:2022');
      expect(tIds[CalendarIntervalEnum.Quarterly]).toEqual('Y:2022;Q:1');
      expect(tIds[CalendarIntervalEnum.Monthly]).toEqual('Y:2022;Q:1;M:2');
      expect(tIds[CalendarIntervalEnum.Weekly]).toEqual('Y:2022;Q:1;M:2;W:7');
      expect(tIds[CalendarIntervalEnum.Daily]).toEqual('Y:2022;Q:1;M:2;W:7;D:20');
    })
  });

  describe('toTimingId', () => {
    it('date without level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date);
      expect(tid).toEqual('Y:2022;Q:1;M:2;W:7;D:20');
    })

    it('use weekly level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date, CalendarIntervalEnum.Weekly);
      expect(tid).toEqual('Y:2022;Q:1;M:2;W:7');
    })

    it('use monthly level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date, CalendarIntervalEnum.Monthly);
      expect(tid).toEqual('Y:2022;Q:1;M:2');
    })

    it('use quarterly level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date, CalendarIntervalEnum.Quarterly);
      expect(tid).toEqual('Y:2022;Q:1');
    })

    it('use yearly level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date, CalendarIntervalEnum.Yearly);
      expect(tid).toEqual('Y:2022');
    })

    it('use unscheduled level', () => {
      const date = new Date('2022-02-20');
      const tid = toTimingId(date, CalendarIntervalEnum.Unscheduled);
      expect(tid).toEqual('U');
    })

    it('sort order', () => {
      const tid  = toTimingId(new Date('2022-02-20'));
      const tid2 = toTimingId(new Date('2022-02-21'));
      expect(tid < tid2).toEqual(true);
    })

    it('sort order with different interval same date', () => {
      const tid  = toTimingId(new Date('2022-02-20'), CalendarIntervalEnum.Daily);
      const tid2 = toTimingId(new Date('2022-02-20'), CalendarIntervalEnum.Weekly);
      expect(tid2 < tid).toEqual(true);
    })

    it('sort order with different interval different date', () => {
      const tid  = toTimingId(new Date('2021-02-20'), CalendarIntervalEnum.Daily);
      const tid2 = toTimingId(new Date('2022-02-20'), CalendarIntervalEnum.Yearly);
      expect(tid < tid2).toEqual(true);
    })
  });
})
