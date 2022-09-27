import {
    CalendarPlan,
    DailyPlan,
    MonthlyPlan,
    QuarterlyPlan,
    UnscheduledPlan,
    WeeklyPlan, YearlyPlan,
    CalendarIntervalEnum,
    Days, getFullDayDate
} from '@/calendar';

describe('CalendarPlan', () => {
    describe('UnscheduledPlan', function () {
        it('init', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Unscheduled);
        });

        it('getTimingUniqueId', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            expect(plan.getTimingUniqueId(new Date())).toEqual('U');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            const timing = plan.createTimingInstance(new Date());
            expect(timing.tid).toEqual('U');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Unscheduled);
            expect(timing.year).toBeUndefined();
            expect(timing.quarter).toBeUndefined();
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
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
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Yearly);
        });

        it('getTimingUniqueId', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            expect(plan.getTimingUniqueId('2021-01-01')).toEqual('Y:2021');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            const timing = plan.createTimingInstance('2021-01-01');
            expect(timing.tid).toEqual('Y:2021');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Yearly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toBeUndefined();
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
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
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Quarterly);
        });

        it('getTimingUniqueId first quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-01-01')).toEqual('Y:2021;Q:1');
            expect(plan.getTimingUniqueId('2021-03-31')).toEqual('Y:2021;Q:1');
        });

        it('getTimingUniqueId second quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-04-01')).toEqual('Y:2021;Q:2');
            expect(plan.getTimingUniqueId('2021-06-30')).toEqual('Y:2021;Q:2');
        });

        it('getTimingUniqueId third quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-07-01')).toEqual('Y:2021;Q:3');
            expect(plan.getTimingUniqueId('2021-09-30')).toEqual('Y:2021;Q:3');
        });

        it('getTimingUniqueId third quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-10-01')).toEqual('Y:2021;Q:4');
            expect(plan.getTimingUniqueId('2021-12-31')).toEqual('Y:2021;Q:4');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            const timing = plan.createTimingInstance('2021-01-01');
            expect(timing.tid).toEqual('Y:2021;Q:1');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Quarterly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
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
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Monthly);
        });

        it('getTimingUniqueId first quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-01-01')).toEqual('Y:2021;Q:1;M:1');
            expect(plan.getTimingUniqueId('2021-03-31')).toEqual('Y:2021;Q:1;M:3');
        });

        it('getTimingUniqueId second quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-04-01')).toEqual('Y:2021;Q:2;M:4');
            expect(plan.getTimingUniqueId('2021-06-30')).toEqual('Y:2021;Q:2;M:6');
        });

        it('getTimingUniqueId third quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-07-01')).toEqual('Y:2021;Q:3;M:7');
            expect(plan.getTimingUniqueId('2021-09-30')).toEqual('Y:2021;Q:3;M:9');
        });

        it('getTimingUniqueId forth quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-10-01')).toEqual('Y:2021;Q:4;M:10');
            expect(plan.getTimingUniqueId('2021-12-31')).toEqual('Y:2021;Q:4;M:12');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            const timing = plan.createTimingInstance('2021-01-01');
            expect(timing.tid).toEqual('Y:2021;Q:1;M:1');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Monthly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
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
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Weekly);
        });

        it('getTimingUniqueId first quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-01-01')).toEqual('Y:2021;Q:1;M:1;W:53');
            expect(plan.getTimingUniqueId('2021-03-31')).toEqual('Y:2021;Q:1;M:3;W:13');
        });

        it('getTimingUniqueId second quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-04-01')).toEqual('Y:2021;Q:2;M:4;W:13');
            expect(plan.getTimingUniqueId('2021-06-30')).toEqual('Y:2021;Q:2;M:6;W:26');
        });

        it('getTimingUniqueId third quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-07-01')).toEqual('Y:2021;Q:3;M:7;W:26');
            expect(plan.getTimingUniqueId('2021-09-30')).toEqual('Y:2021;Q:3;M:9;W:39');
        });

        it('getTimingUniqueId fourth quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-10-01')).toEqual('Y:2021;Q:4;M:10;W:39');
            expect(plan.getTimingUniqueId('2021-12-31')).toEqual('Y:2021;Q:4;M:12;W:52');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            const timing = plan.createTimingInstance('2021-01-01');
            expect(timing.tid).toEqual('Y:2021;Q:1;M:1;W:53');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Weekly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.isoWeekOfYear).toEqual(53);
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
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
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Daily);
        });

        it('getTimingUniqueId first quarter de', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-01-01')).toEqual('Y:2021;Q:1;M:1;W:53;D:1');
            expect(plan.getTimingUniqueId('2021-03-31')).toEqual('Y:2021;Q:1;M:3;W:13;D:31');
        });

        it('getTimingUniqueId second quarter de', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-04-01')).toEqual('Y:2021;Q:2;M:4;W:13;D:1');
            expect(plan.getTimingUniqueId('2021-06-30')).toEqual('Y:2021;Q:2;M:6;W:26;D:30');
        });

        it('getTimingUniqueId third quarter de', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-07-01')).toEqual('Y:2021;Q:3;M:7;W:26;D:1');
            expect(plan.getTimingUniqueId('2021-09-30')).toEqual('Y:2021;Q:3;M:9;W:39;D:30');
        });

        it('getTimingUniqueId third quarter', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-10-01')).toEqual('Y:2021;Q:4;M:10;W:39;D:1');
            expect(plan.getTimingUniqueId('2021-12-31')).toEqual('Y:2021;Q:4;M:12;W:52;D:31');
        });

        it('createTimingInstance', async () => {
            const plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            const timing = plan.createTimingInstance('2021-01-01');
            expect(timing.tid).toEqual('Y:2021;Q:1;M:1;W:53;D:1');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Daily);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.isoWeekOfYear).toEqual(53);
            expect(timing.dayOfWeek).toEqual(Days.Friday);
            expect(timing.dayOfMonth).toEqual(1);
            expect(timing.date).toEqual(getFullDayDate('2021-01-01'));
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
