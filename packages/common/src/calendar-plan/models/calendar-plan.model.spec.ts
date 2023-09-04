import { CalendarInterval } from '@lyvely/calendar';

import {
  CalendarPlan,
  DailyPlan,
  MonthlyPlan,
  QuarterlyPlan,
  UnscheduledPlan,
  WeeklyPlan,
  YearlyPlan,
} from '@lyvely/calendar-plan';

describe('CalendarPlan', () => {
  describe('UnscheduledPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Unscheduled);
      expect(plan.getInterval()).toEqual(CalendarInterval.Unscheduled);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Unscheduled);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Unscheduled);
      expect(plan1).toBeInstanceOf(UnscheduledPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new UnscheduledPlan());
    });
  });

  describe('YearlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Yearly);
      expect(plan.getInterval()).toEqual(CalendarInterval.Yearly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Yearly);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Yearly);
      expect(plan1).toBeInstanceOf(YearlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new YearlyPlan());
    });
  });

  describe('QuarterlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Quarterly);
      expect(plan.getInterval()).toEqual(CalendarInterval.Quarterly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Quarterly);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Quarterly);
      expect(plan1).toBeInstanceOf(QuarterlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new QuarterlyPlan());
    });
  });

  describe('MonthlyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Monthly);
      expect(plan.getInterval()).toEqual(CalendarInterval.Monthly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Monthly);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Monthly);
      expect(plan1).toBeInstanceOf(MonthlyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new MonthlyPlan());
    });
  });

  describe('WeeklyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Weekly);
      expect(plan.getInterval()).toEqual(CalendarInterval.Weekly);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Weekly);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Weekly);
      expect(plan1).toBeInstanceOf(WeeklyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new WeeklyPlan());
    });
  });

  describe('DailyPlan', function () {
    it('init', async () => {
      const plan = CalendarPlan.getInstance(CalendarInterval.Daily);
      expect(plan.getInterval()).toEqual(CalendarInterval.Daily);
    });

    it('singleton', async () => {
      const plan1 = CalendarPlan.getInstance(CalendarInterval.Daily);
      const plan2 = CalendarPlan.getInstance(CalendarInterval.Daily);
      expect(plan1).toBeInstanceOf(DailyPlan);
      expect(plan1).toBe(plan2);
      expect(plan1).not.toBe(new DailyPlan());
    });
  });
});
