import { CalendarIntervalEnum } from '@/calendar';

import {
  CalendarPlan,
  DailyPlan,
  MonthlyPlan,
  QuarterlyPlan,
  UnscheduledPlan,
  WeeklyPlan,
  YearlyPlan,
} from '@/calendar-plan';

describe('CalendarPlan', () => {
  describe('UnscheduledPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Unscheduled);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
      expect(plan1).toBeInstanceOf(UnscheduledPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new UnscheduledPlan());
    });
  });

  describe('YearlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Yearly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
      expect(plan1).toBeInstanceOf(YearlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new YearlyPlan());
    });
  });

  describe('QuarterlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Quarterly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
      expect(plan1).toBeInstanceOf(QuarterlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new QuarterlyPlan());
    });
  });

  describe('MonthlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Monthly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
      expect(plan1).toBeInstanceOf(MonthlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new MonthlyPlan());
    });
  });

  describe('WeeklyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Weekly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
      expect(plan1).toBeInstanceOf(WeeklyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new WeeklyPlan());
    });
  });

  describe('DailyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
      expect(plan.getInterval()).toEqual(CalendarIntervalEnum.Daily);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
      const plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
      expect(plan1).toBeInstanceOf(DailyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new DailyPlan());
    });
  });
});
