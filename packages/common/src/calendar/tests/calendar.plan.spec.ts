import {
    CalendarPlan,
    DailyPlan,
    MonthlyPlan,
    QuarterlyPlan,
    UnscheduledPlan,
    WeeklyPlan, YearlyPlan,
    CalendarIntervalEnum,
    Days, getFullDayDate
} from '../../index';

describe('CalendarPlan', () => {
    describe('UnscheduledPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Unscheduled);
        });

        it('getTimingUniqueId', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            expect(plan.getTimingUniqueId(new Date(), 'de')).toEqual('0:unscheduled');
        });

        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            let timing = plan.createTimingInstance(new Date(), 'de');
            expect(timing.timingId).toEqual('0:unscheduled');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Unscheduled);
            expect(timing.year).toBeUndefined();
            expect(timing.quarter).toBeUndefined();
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.weekOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Unscheduled);
            expect(plan1).toBeInstanceOf(UnscheduledPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new UnscheduledPlan());
        });
    });

    describe('YearlyPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Yearly);
        });

        it('getTimingUniqueId', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            expect(plan.getTimingUniqueId('2021-01-01', 'de')).toEqual('1:Y:2021');
        });

        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            let timing = plan.createTimingInstance('2021-01-01', 'de');
            expect(timing.timingId).toEqual('1:Y:2021');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Yearly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toBeUndefined();
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.weekOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Yearly);
            expect(plan1).toBeInstanceOf(YearlyPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new YearlyPlan());
        });
    });

    describe('QuarterlyPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Quarterly);
        });

        it('getTimingUniqueId first quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-01-01', 'de')).toEqual('2:Y:2021:Q:1');
            expect(plan.getTimingUniqueId('2021-03-31', 'de')).toEqual('2:Y:2021:Q:1');
        });

        it('getTimingUniqueId second quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-04-01', 'de')).toEqual('2:Y:2021:Q:2');
            expect(plan.getTimingUniqueId('2021-06-30', 'de')).toEqual('2:Y:2021:Q:2');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-07-01', 'de')).toEqual('2:Y:2021:Q:3');
            expect(plan.getTimingUniqueId('2021-09-30', 'de')).toEqual('2:Y:2021:Q:3');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan.getTimingUniqueId('2021-10-01', 'de')).toEqual('2:Y:2021:Q:4');
            expect(plan.getTimingUniqueId('2021-12-31', 'de')).toEqual('2:Y:2021:Q:4');
        });

        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            let timing = plan.createTimingInstance('2021-01-01', 'de');
            expect(timing.timingId).toEqual('2:Y:2021:Q:1');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Quarterly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toBeUndefined();
            expect(timing.weekOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Quarterly);
            expect(plan1).toBeInstanceOf(QuarterlyPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new QuarterlyPlan());
        });
    });

    describe('MonthlyPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Monthly);
        });

        it('getTimingUniqueId first quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-01-01', 'de')).toEqual('3:Y:2021:M:0');
            expect(plan.getTimingUniqueId('2021-03-31', 'de')).toEqual('3:Y:2021:M:2');
        });

        it('getTimingUniqueId second quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-04-01', 'de')).toEqual('3:Y:2021:M:3');
            expect(plan.getTimingUniqueId('2021-06-30', 'de')).toEqual('3:Y:2021:M:5');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-07-01', 'de')).toEqual('3:Y:2021:M:6');
            expect(plan.getTimingUniqueId('2021-09-30', 'de')).toEqual('3:Y:2021:M:8');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan.getTimingUniqueId('2021-10-01', 'de')).toEqual('3:Y:2021:M:9');
            expect(plan.getTimingUniqueId('2021-12-31', 'de')).toEqual('3:Y:2021:M:11');
        });

        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            let timing = plan.createTimingInstance('2021-01-01', 'de');
            expect(timing.timingId).toEqual('3:Y:2021:M:0');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Monthly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.weekOfYear).toBeUndefined();
            expect(timing.isoWeekOfYear).toBeUndefined();
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Monthly);
            expect(plan1).toBeInstanceOf(MonthlyPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new MonthlyPlan());
        });
    });

    describe('WeeklyPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Weekly);
        });

        it('getTimingUniqueId first quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-01-01', 'de')).toEqual('4:Y:2020:W:53');
            expect(plan.getTimingUniqueId('2021-03-31', 'de')).toEqual('4:Y:2021:W:13');
        });

        it('getTimingUniqueId first quarter en-US', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-01-01', 'en-US')).toEqual('4:Y:2021:W:1');
            expect(plan.getTimingUniqueId('2021-03-31', 'en-US')).toEqual('4:Y:2021:W:14');
        });

        it('getTimingUniqueId second quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-04-01', 'de')).toEqual('4:Y:2021:W:13');
            expect(plan.getTimingUniqueId('2021-06-30', 'de')).toEqual('4:Y:2021:W:26');
        });

        it('getTimingUniqueId second quarter en-US', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-04-01', 'en-US')).toEqual('4:Y:2021:W:14');
            expect(plan.getTimingUniqueId('2021-06-30', 'en-US')).toEqual('4:Y:2021:W:27');
        });

        it('getTimingUniqueId third quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-07-01', 'de')).toEqual('4:Y:2021:W:26');
            expect(plan.getTimingUniqueId('2021-09-30', 'de')).toEqual('4:Y:2021:W:39');
        });

        it('getTimingUniqueId third quarter en-US', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-07-01', 'en-US')).toEqual('4:Y:2021:W:27');
            expect(plan.getTimingUniqueId('2021-09-30', 'en-US')).toEqual('4:Y:2021:W:40');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-10-01', 'de')).toEqual('4:Y:2021:W:39');
            expect(plan.getTimingUniqueId('2021-12-31', 'de')).toEqual('4:Y:2021:W:52');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan.getTimingUniqueId('2021-10-01', 'en-US')).toEqual('4:Y:2021:W:40');
            expect(plan.getTimingUniqueId('2021-12-31', 'en-US')).toEqual('4:Y:2022:W:1');
        });


        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            let timing = plan.createTimingInstance('2021-01-01', 'de');
            expect(timing.timingId).toEqual('4:Y:2020:W:53');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Weekly);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.weekOfYear).toEqual(53);
            expect(timing.isoWeekOfYear).toEqual(53);
            expect(timing.dayOfWeek).toBeUndefined();
            expect(timing.dayOfMonth).toBeUndefined();
            expect(timing.date).toBeUndefined();
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Weekly);
            expect(plan1).toBeInstanceOf(WeeklyPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new WeeklyPlan());
        });
    });

    describe('DailyPlan', function () {
        it('init', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getPlan()).toEqual(CalendarIntervalEnum.Daily);
        });

        it('getTimingUniqueId first quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-01-01', 'de')).toEqual('5:Y:2021:M:0:D:1');
            expect(plan.getTimingUniqueId('2021-03-31', 'de')).toEqual('5:Y:2021:M:2:D:31');
        });

        it('getTimingUniqueId second quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-04-01', 'de')).toEqual('5:Y:2021:M:3:D:1');
            expect(plan.getTimingUniqueId('2021-06-30', 'de')).toEqual('5:Y:2021:M:5:D:30');
        });

        it('getTimingUniqueId third quarter de', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-07-01', 'de')).toEqual('5:Y:2021:M:6:D:1');
            expect(plan.getTimingUniqueId('2021-09-30', 'de')).toEqual('5:Y:2021:M:8:D:30');
        });

        it('getTimingUniqueId third quarter', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan.getTimingUniqueId('2021-10-01', 'de')).toEqual('5:Y:2021:M:9:D:1');
            expect(plan.getTimingUniqueId('2021-12-31', 'de')).toEqual('5:Y:2021:M:11:D:31');
        });

        it('createTimingInstance', async () => {
            let plan = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            let timing = plan.createTimingInstance('2021-01-01', 'de');
            expect(timing.timingId).toEqual('5:Y:2021:M:0:D:1');
            expect(timing.interval).toEqual(CalendarIntervalEnum.Daily);
            expect(timing.year).toEqual(2021);
            expect(timing.quarter).toEqual(1);
            expect(timing.monthOfYear).toEqual(0);
            expect(timing.weekOfYear).toEqual(53);
            expect(timing.isoWeekOfYear).toEqual(53);
            expect(timing.dayOfWeek).toEqual(Days.Friday);
            expect(timing.dayOfMonth).toEqual(1);
            expect(timing.date).toEqual(getFullDayDate('2021-01-01'));
        });

        it('singleton', async () => {
            let plan1 = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            let plan2 = CalendarPlan.getInstance(CalendarIntervalEnum.Daily);
            expect(plan1).toBeInstanceOf(DailyPlan);
            expect(plan1).toBe(plan2);
            expect(plan1).not.toBe(new DailyPlan());
        });

    });
});