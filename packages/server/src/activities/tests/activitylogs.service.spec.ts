import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ActivityDataPointService } from '../services/activity-data-point.service';
import { ActivityTestDataUtil, createActivityTestingModule } from './utils/activities.test.utils';
import { TimeSeriesRangeFilter } from 'lyvely-common';
import { Model } from 'mongoose';
import { ActivityDataPointDocument } from '../schemas';

describe('ActivitylogsService', () => {
  let testingModule: TestingModule;
  let activityLogsService: ActivityDataPointService;
  let testData: ActivityTestDataUtil;
  let ActivityLogModel: Model<ActivityDataPointDocument>;

  const TEST_KEY = 'acitivty_logs_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [ActivityDataPointService]).compile();
    activityLogsService = testingModule.get<ActivityDataPointService>(ActivityDataPointService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
    ActivityLogModel = testingModule.get<Model<ActivityDataPointDocument>>('ActivityLogModel');
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('findLogsByRange', () => {
    it('no logs available', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      const logs = await activityLogsService.findLogsByRange(
        profile,
        new TimeSeriesRangeFilter({from: '2021-04-03', to: '2021-04-04'}),
      );

      expect(logs.length).toEqual(0);
    });
  });

  describe('updateLog', () => {
    it('update non existing log', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habit = await testData.createHabit(user, profile, 'test', {  max: 2, value: 5 });

      const log = await activityLogsService.updateLog(
        user,
        profile,
        habit,
        '2021-01-01',
        2,
      );

      expect(log.timing).toBeDefined();
      expect(log.value).toEqual(2);
      expect(log.score).toEqual(10);

      const logs = await ActivityLogModel.find({timingModel: habit._id}).exec();
      expect(logs.length).toEqual(1);
    });
  });
    /*
        it('update existing log', async () => {
          const profile = await registerTestUser();
          const activity = await createHabit(profile);

          // create empty activity logs
          await activityLogsService.updateLog(profile, activity, '2021-01-01', 0);
          await activityLogsService.updateLog(profile, activity, '2021-01-02', 0);
          await activityLogsService.updateLog(profile, activity, '2021-01-03', 0);

          const log = await activityLogsService.updateLog(
            profile,
            activity,
            '2021-01-02',
            2,
          );
          expect(log.value).toEqual(2);
          expect(log.score).toEqual(10);

          const search = await ActivityLogModel.find({
            timingModel: activity._id,
          }).exec();
          expect(search.length).toEqual(3);

          const logs = await activityLogsService.findLogsByRange(
            profile.owner,
            new CalendarRangeFilter({ from: '2021-01-01', to: '2021-01-03' }),
          );

          const store = new ActivityLogStore();
          store.addLogs(logs);

          const searchLog = store.getLog(
            activity,
            buildTimingId(activity.plan, '2021-01-02', profile.owner.getLocale()),
          );
          expect(searchLog._id.toString()).toEqual(log._id.toString());
          expect(searchLog.value).toEqual(2);
          expect(searchLog.score).toEqual(10);
        });

        it('update respects max', async () => {
          const profile = await registerTestUser();
          const activity = await createHabit(profile);

          // create activity logs
          // create empty activity logs
          await activityLogsService.updateLog(profile, activity, '2021-01-01', 0);
          await activityLogsService.updateLog(profile, activity, '2021-01-02', 0);
          await activityLogsService.updateLog(profile, activity, '2021-01-03', 0);

          const log = await activityLogsService.updateLog(
            profile,
            activity,
            '2021-01-02',
            16,
          );
          expect(log.value).toEqual(5);
          expect(log.score).toEqual(25);
        });

        // Todo: test units > max etc.
      });*/
});
