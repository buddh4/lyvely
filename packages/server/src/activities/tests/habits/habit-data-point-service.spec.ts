import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';
import { HabitDataPointService } from "../../services/habit-data-point.service";
import { HabitDataPointDao } from "../../daos/habit-data-point.dao";
import { UserAssignmentStrategy, toTimingId } from "lyvely-common";
import { ActivityScoreActionService } from "../../services/activity-score-action.service";
import { ActivityScoreActionDao } from "../../daos/activity-score-action.dao";

describe('HabitDataPointService', () => {
  let habitDataPointService: HabitDataPointService;
  let testingModule: TestingModule;
  let testData: ActivityTestDataUtil;
  let activityScoreDao: ActivityScoreActionDao;

  const TEST_KEY = 'habit_data_point_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [
        HabitDataPointService,
      HabitDataPointDao,
      ActivityScoreActionService,
      ActivityScoreActionDao
    ] ).compile();
    habitDataPointService = testingModule.get<HabitDataPointService>(HabitDataPointService);
    testData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
    activityScoreDao = testingModule.get<ActivityScoreActionDao>(ActivityScoreActionDao);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('update shared habit', () => {
    it('create new data point', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.Shared  });
      const dataPoint = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.meta.uid).not.toBeDefined();
      expect(dataPoint.tid).toEqual(toTimingId(new Date));
      expect(dataPoint.value).toEqual(2);
    });

    it('update existing data point value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.Shared });
      const dataPoint1 = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);
      const dataPoint2 = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 3);
      expect(dataPoint2._id).toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('track profile score', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      expect(profile.score).toEqual(0);

      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.Shared, score: 5 });
      await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);

      expect(profile.score).toEqual(10);

      await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 0);

      expect(profile.score).toEqual(0);
    });

    it('activity score action is created', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.Shared, score: 5 });
      await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);
      await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 0);

      const scores = await activityScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[0].uid).not.toBeDefined();
      expect(scores[1].score).toEqual(-10);
      expect(scores[1].uid).not.toBeDefined();
    });
  });

  describe('update per user habit', () => {
    it('create new data point', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.PerUser  });
      const dataPoint = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.meta.uid).toEqual(user._id);
      expect(dataPoint.tid).toEqual(toTimingId(new Date));
      expect(dataPoint.value).toEqual(2);
    });

    it('update existing data point value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, { max: 3, userStrategy: UserAssignmentStrategy.PerUser });
      const dataPoint1 = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 2);
      const dataPoint2 = await habitDataPointService.updateOrCreateDataPoint(profile, user, habit, new Date(), 3);
      expect(dataPoint2._id).toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('distinct user data points', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      const habit = await testData.createHabit(owner, group, { max: 3, userStrategy: UserAssignmentStrategy.PerUser });
      const dataPoint1 = await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 2);
      const dataPoint2 = await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 3);
      expect(dataPoint2._id).not.toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('score is managed independently', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, { max: 3, userStrategy: UserAssignmentStrategy.PerUser, score: 5 });
      await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 1);
      await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('score is managed independently', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, { max: 3, userStrategy: UserAssignmentStrategy.PerUser, score: 5 });
      await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 1);
      await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('activity score action is created', async () => {
      const { owner, user, group } = await testData.createSmallGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, { max: 3, userStrategy: UserAssignmentStrategy.PerUser, score: 5 });
      await habitDataPointService.updateOrCreateDataPoint(group, owner, habit, new Date(), 2);
      await habitDataPointService.updateOrCreateDataPoint(group, user, habit, new Date(), 1);

      const scores = await activityScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[0].uid).toEqual(owner._id);
      expect(scores[1].score).toEqual(5);
      expect(scores[1].uid).toEqual(user._id);
    });
  });
});
