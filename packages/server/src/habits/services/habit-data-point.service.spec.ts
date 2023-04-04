import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { HabitTestDataUtil, createHabitTestingModule } from '../test';
import { HabitDataPointService } from './habit-data-point.service';
import { HabitDataPointDao } from '../daos';
import {
  UserAssignmentStrategy,
  toTimingId,
  DataPointIntervalFilter,
  CalendarIntervalEnum,
} from '@lyvely/common';
import { ContentScoreDao, ContentScoreService } from '@/content';
import { Model } from 'mongoose';
import { DataPoint } from '@/time-series';

describe('HabitDataPointService', () => {
  let habitDataPointService: HabitDataPointService;
  let testingModule: TestingModule;
  let testData: HabitTestDataUtil;
  let activityScoreDao: ContentScoreDao;
  let HabitDataPointModel: Model<DataPoint>;

  const TEST_KEY = 'habit_data_point_service';

  beforeEach(async () => {
    testingModule = await createHabitTestingModule(TEST_KEY, [
      HabitDataPointService,
      HabitDataPointDao,
      ContentScoreService,
      ContentScoreDao,
    ]).compile();
    habitDataPointService = testingModule.get<HabitDataPointService>(HabitDataPointService);
    testData = testingModule.get(HabitTestDataUtil);
    activityScoreDao = testingModule.get<ContentScoreDao>(ContentScoreDao);
    HabitDataPointModel = testingModule.get<Model<DataPoint>>('DataPointModel');
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('findLogsByRange', () => {
    it('no dataPoint available', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      const logs = await habitDataPointService.findByIntervalLevel(
        profile,
        user,
        new DataPointIntervalFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(0);
    });

    it('find existing data point', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);

      await habitDataPointService.upsertDataPoint(profile, user, habit, '2021-04-03', 2);

      const logs = await habitDataPointService.findByIntervalLevel(
        profile,
        user,
        new DataPointIntervalFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(1);
    });

    it('find existing data point for unscheduled habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarIntervalEnum.Unscheduled,
      });

      await habitDataPointService.upsertDataPoint(profile, user, habit, '2021-04-03', 2);

      const logs = await habitDataPointService.findByIntervalLevel(
        profile,
        user,
        new DataPointIntervalFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(1);
    });
  });

  describe('updateLog', () => {
    it('update non existing log', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const habit = await testData.createHabit(user, profile, { title: 'test', max: 2, score: 5 });

      const { dataPoint } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        '2021-01-01',
        2,
      );

      expect(dataPoint.tid).toEqual(toTimingId('2021-01-01'));
      expect(dataPoint.value).toEqual(2);

      const logs = await HabitDataPointModel.find({ timingModel: habit._id }).exec();
      expect(logs.length).toEqual(1);
    });
  });

  describe('update shared habit', () => {
    it('create new data point', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      const { dataPoint } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        2,
      );
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.uid).toBeNull();
      expect(dataPoint.tid).toEqual(toTimingId(new Date()));
      expect(dataPoint.value).toEqual(2);
    });

    it('update existing data point value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      const { dataPoint: dataPoint1 } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        2,
      );
      const { dataPoint: dataPoint2 } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        3,
      );
      expect(dataPoint2._id).toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('track profile score', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      expect(profile.score).toEqual(0);

      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(profile, user, habit, new Date(), 2);

      expect(profile.score).toEqual(10);

      await habitDataPointService.upsertDataPoint(profile, user, habit, new Date(), 0);

      expect(profile.score).toEqual(0);
    });

    it('activity score action is created', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(profile, user, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(profile, user, habit, new Date(), 0);

      const scores = await activityScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[0].uid).toBeNull();
      expect(scores[1].score).toEqual(-10);
      expect(scores[1].uid).toBeNull();
    });
  });

  describe('update per user habit', () => {
    it('create new data point', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });
      const { dataPoint } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        2,
      );
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.uid).toEqual(user._id);
      expect(dataPoint.tid).toEqual(toTimingId(new Date()));
      expect(dataPoint.value).toEqual(2);
    });

    it('update existing data point value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });
      const { dataPoint: dataPoint1 } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        2,
      );
      const { dataPoint: dataPoint2 } = await habitDataPointService.upsertDataPoint(
        profile,
        user,
        habit,
        new Date(),
        3,
      );
      expect(dataPoint2._id).toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('distinct user data points', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });
      const { dataPoint: dataPoint1 } = await habitDataPointService.upsertDataPoint(
        group,
        owner,
        habit,
        new Date(),
        2,
      );
      const { dataPoint: dataPoint2 } = await habitDataPointService.upsertDataPoint(
        group,
        user,
        habit,
        new Date(),
        3,
      );
      expect(dataPoint2._id).not.toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('score is managed independently', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(group, user, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.upsertDataPoint(group, owner, habit, new Date(), 1);
      await habitDataPointService.upsertDataPoint(group, user, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('score is managed independently', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(group, user, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.upsertDataPoint(group, owner, habit, new Date(), 1);
      await habitDataPointService.upsertDataPoint(group, user, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('activity score action is created', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(group, user, habit, new Date(), 1);

      const scores = await activityScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[0].uid).toEqual(owner._id);
      expect(scores[1].score).toEqual(5);
      expect(scores[1].uid).toEqual(user._id);
    });
  });
});
