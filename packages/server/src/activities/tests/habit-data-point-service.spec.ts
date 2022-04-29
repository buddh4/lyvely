import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { HabitDataPointService } from '../services/habit-data-point.service';
import { ActivityTestDataUtil, createActivityTestingModule } from './utils/activities.test.utils';
import { Model } from 'mongoose';
import { HabitDataPointDocument } from '../schemas';
import { DataPointIntervalFilter, toTimingId } from "lyvely-common";
import { HabitDataPointDao } from "../daos/habit-data-point.dao";

describe('HabitDataPointService', () => {
  let testingModule: TestingModule;
  let habitDataPointService: HabitDataPointService;
  let testData: ActivityTestDataUtil;
  let HabitDataPointModel: Model<HabitDataPointDocument>;

  const TEST_KEY = 'habit_data_point_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [HabitDataPointService, HabitDataPointDao]).compile();
    habitDataPointService = testingModule.get<HabitDataPointService>(HabitDataPointService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
    HabitDataPointModel = testingModule.get<Model<HabitDataPointDocument>>('HabitDataPointModel');
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
    HabitDataPointModel.deleteMany({});
  });

  describe('findLogsByRange', () => {
    it('no logs available', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      const logs = await habitDataPointService.findByIntervalLevel(
        profile,
        user,
        new DataPointIntervalFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(0);
    });
  });

  describe('updateLog', () => {
    it('update non existing log', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habit = await testData.createHabit(user, profile, {  title: 'test',  max: 2, score: 5 });

      const log = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        '2021-01-01',
        2,
      );

      expect(log.tid).toEqual(toTimingId('2021-01-01'));
      expect(log.value).toEqual(2);

      const logs = await HabitDataPointModel.find({ timingModel: habit._id }).exec();
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
