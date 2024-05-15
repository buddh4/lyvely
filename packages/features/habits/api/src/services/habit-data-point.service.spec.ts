import { HabitTestDataUtil, habitITestPlugin } from '../testing';
import { HabitDataPointService } from './habit-data-point.service';
import { HabitDataPointDao } from '../daos';
import { CalendarInterval, toTimingId } from '@lyvely/dates';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import {
  UserAssignmentStrategy,
  ContentScoreDao,
  ContentScoreService,
  Model,
  buildProfileTest,
} from '@lyvely/api';
import { DataPoint } from '@lyvely/time-series';
import { ILyvelyTestingModule } from '@lyvely/testing';

describe('HabitDataPointService', () => {
  let habitDataPointService: HabitDataPointService;
  let testingModule: ILyvelyTestingModule;
  let testData: HabitTestDataUtil;
  let contentScoreDao: ContentScoreDao;
  let HabitDataPointModel: Model<DataPoint>;

  const TEST_KEY = 'habit_data_point_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([habitITestPlugin])
      .providers([HabitDataPointService, HabitDataPointDao, ContentScoreService, ContentScoreDao])
      .compile();
    habitDataPointService = testingModule.get<HabitDataPointService>(HabitDataPointService);
    testData = testingModule.get(HabitTestDataUtil);
    contentScoreDao = testingModule.get<ContentScoreDao>(ContentScoreDao);
    HabitDataPointModel = testingModule.get<Model<DataPoint>>('HabitDataPointModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('findLogsByRange', () => {
    it('no dataPoint available', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      await testData.createHabit(user, profile);

      const logs = await habitDataPointService.findByIntervalLevel(
        context,
        new CalendarPlanFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(0);
    });

    it('find existing data point', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile);

      await habitDataPointService.upsertDataPoint(context, habit, '2021-04-03', 2);

      const logs = await habitDataPointService.findByIntervalLevel(
        context,
        new CalendarPlanFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(1);
    });

    it('find existing data point for unscheduled habit', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Unscheduled,
      });

      await habitDataPointService.upsertDataPoint(context, habit, '2021-04-03', 2);

      const logs = await habitDataPointService.findByIntervalLevel(
        context,
        new CalendarPlanFilter('2021-04-03'),
      );

      expect(logs.length).toEqual(1);
    });
  });

  describe('upsertDataPoint', () => {
    it('update non existing log', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();

      const habit = await testData.createHabit(user, profile, { title: 'test', max: 2, score: 5 });

      const { dataPoint } = await habitDataPointService.upsertDataPoint(
        context,
        habit,
        '2021-01-01',
        2,
      );

      expect(dataPoint.tid).toEqual(toTimingId('2021-01-01'));
      expect(dataPoint.value).toEqual(2);

      const logs = await HabitDataPointModel.find({ cid: habit._id }).exec();
      expect(logs.length).toEqual(1);
    });
  });

  describe('update shared habit', () => {
    it('create new data point', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      const { dataPoint, isNew } = await habitDataPointService.upsertDataPoint(
        context,
        habit,
        new Date(),
        2,
      );
      expect(isNew).toEqual(true);
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.uid).toBeNull();
      expect(dataPoint.tid).toEqual(toTimingId(new Date()));
      expect(dataPoint.value).toEqual(2);
    });

    it('update existing data point value', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
      });

      const date = new Date();

      await habitDataPointService.upsertDataPoint(context, habit, date, 2);

      const { dataPoint, isNew } = await habitDataPointService.upsertDataPoint(
        context,
        habit,
        date,
        3,
      );

      const updatedDataPoint = await habitDataPointService.findDataPointByDate(
        context,
        habit,
        date,
      );

      expect(isNew).toEqual(false);
      expect(updatedDataPoint?._id).toEqual(dataPoint._id);
      expect(dataPoint.value).toEqual(3);
      expect(updatedDataPoint?.value).toEqual(3);
    });

    it('track profile score', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      expect(profile.score).toEqual(0);

      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(context, habit, new Date(), 2);

      expect(profile.score).toEqual(10);

      await habitDataPointService.upsertDataPoint(context, habit, new Date(), 0);

      expect(profile.score).toEqual(0);
    });

    it('habit score action is created', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.Shared,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(context, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(context, habit, new Date(), 0);

      const scores = await contentScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[1].score).toEqual(-10);
      expect(scores[1].uid).toEqual(user._id);
    });
  });

  describe('update per user habit', () => {
    it('create new data point', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });
      const { dataPoint } = await habitDataPointService.upsertDataPoint(
        context,
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
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });
      const { dataPoint: dataPoint1 } = await habitDataPointService.upsertDataPoint(
        context,
        habit,
        new Date(),
        2,
      );
      const { dataPoint: dataPoint2 } = await habitDataPointService.upsertDataPoint(
        context,
        habit,
        new Date(),
        3,
      );
      expect(dataPoint2._id).toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('distinct user data points', async () => {
      const { owner, profile, ownerContext, memberContext } = await testData.createSimpleGroup();

      const habit = await testData.createHabit(owner, profile, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
      });

      const { dataPoint: dataPoint1 } = await habitDataPointService.upsertDataPoint(
        ownerContext,
        habit,
        new Date(),
        2,
      );
      const { dataPoint: dataPoint2 } = await habitDataPointService.upsertDataPoint(
        memberContext,
        habit,
        new Date(),
        3,
      );
      expect(dataPoint2._id).not.toEqual(dataPoint1._id);
      expect(dataPoint2.value).toEqual(3);
    });

    it('score is managed independently', async () => {
      const {
        owner,
        ownerContext,
        memberContext,
        profile: group,
      } = await testData.createSimpleGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(ownerContext, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(memberContext, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.upsertDataPoint(ownerContext, habit, new Date(), 1);
      await habitDataPointService.upsertDataPoint(memberContext, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('score is managed independently', async () => {
      const {
        owner,
        ownerContext,
        memberContext,
        profile: group,
      } = await testData.createSimpleGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(ownerContext, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(memberContext, habit, new Date(), 1);
      expect(group.score).toEqual(15);

      await habitDataPointService.upsertDataPoint(ownerContext, habit, new Date(), 1);
      await habitDataPointService.upsertDataPoint(memberContext, habit, new Date(), 0);
      expect(group.score).toEqual(5);
    });

    it('habit score action is created', async () => {
      const {
        owner,
        ownerContext,
        member,
        memberContext,
        profile: group,
      } = await testData.createSimpleGroup();

      expect(group.score).toEqual(0);

      const habit = await testData.createHabit(owner, group, {
        max: 3,
        userStrategy: UserAssignmentStrategy.PerUser,
        score: 5,
      });
      await habitDataPointService.upsertDataPoint(ownerContext, habit, new Date(), 2);
      await habitDataPointService.upsertDataPoint(memberContext, habit, new Date(), 1);

      const scores = await contentScoreDao.findAll({});
      expect(scores.length).toEqual(2);
      expect(scores[0].score).toEqual(10);
      expect(scores[0].uid).toEqual(owner._id);
      expect(scores[1].score).toEqual(5);
      expect(scores[1].uid).toEqual(member._id);
    });
  });
});
