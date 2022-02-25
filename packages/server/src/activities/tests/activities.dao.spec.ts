import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { closeInMongodConnection } from '../../test/utils/mongoose-test.utils';
import { Model } from 'mongoose';
import { ProfileDocument } from '../../profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { UserDocument } from '../../users/schemas/users.schema';
import { ActivityType , buildTimingId, CalendarIntervalEnum } from 'lyvely-common';
import { TestDataUtils } from '../../test/utils/test-data.utils';

import { ActivityDocument, Task } from '../schemas';
import { ActivityTestDataUtil,  createActivityTestingModule } from './utils/activities.test.utils';


describe('Activities DAO', () => {
  let testingModule: TestingModule;
  let ActivityModel: Model<ActivityDocument>;
  let UserModel: Model<UserDocument>;
  let ProfilesModel: Model<ProfileDocument>;
  let activitiesDao: ActivitiesDao;
  let testData: TestDataUtils;
  let activityData: ActivityTestDataUtil;

  const TEST_KEY = 'activities_dao';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [ActivitiesDao]).compile();
    ActivityModel = testingModule.get<Model<ActivityDocument>>('ActivityModel');
    ProfilesModel = testingModule.get<Model<ProfileDocument>>('ProfileModel');
    UserModel = testingModule.get<Model<UserDocument>>('UserModel');
    activitiesDao = testingModule.get<ActivitiesDao>(ActivitiesDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    activityData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await ActivityModel.deleteMany({});
    await UserModel.deleteMany({});
    await ProfilesModel.deleteMany({});
    await closeInMongodConnection('activities service');
  });

  it('should be defined', () => {
    expect(activitiesDao).toBeDefined();
  });

  describe('findByProfileAndId', () => {
    it('find activity without strict type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await activityData.createHabit(user, profile);
      const search = await activitiesDao.findByProfileAndId(profile, content._id);
      expect(search).not.toBeNull();
      expect(search._id).toEqual(content._id);
    });

    it('find activity with strict activity type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await activityData.createHabit(user, profile);
      const search = await activitiesDao.findByProfileAndId(profile, content._id, ActivityType.Habit);
      expect(search).toBeDefined();
      expect(search._id).toEqual(content._id);
    });

    it('do not find activity with wrong activity type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await activityData.createHabit(user, profile);
      const search = await activitiesDao.findByProfileAndId(profile, content._id, ActivityType.Task);
      expect(search).toBeNull();
    });
  });

  describe('findByProfileAndTimingIds', () => {
    it('find habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile);
      const search = await activitiesDao.findByProfileAndTimingIds(profile, []);
      expect(search.length).toEqual(1);
      expect(search.find(c => c.title === habit.title)).toBeDefined();
    });

    it('find task done today', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = buildTimingId(CalendarIntervalEnum.Daily, new Date(), profile.getLocale());
      const task = await activityData.createTask(user, profile, null, { done: todayTimingId });
      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, [todayTimingId]);
      expect(search.length).toEqual(1);
      expect(search[0].done).toEqual(todayTimingId);
      expect(search.find(c => c.title === task.title)).toBeDefined();
    });

    it('do not find task not done today', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = buildTimingId(CalendarIntervalEnum.Daily, new Date(), profile.getLocale());
      const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
      const tomorrowTimingId = buildTimingId(CalendarIntervalEnum.Daily, tomorrow, profile.getLocale());
      await activityData.createTask(user, profile, null, { done: tomorrowTimingId });
      const search = await activitiesDao.findByProfileAndTimingIds(profile, [todayTimingId]);
      expect(search.length).toEqual(0);
    });
  });

  describe('updateBulk', () => {
    it('update multiple activities', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task1 =  await activityData.createTask(user, profile);
      const task2 = await activityData.createTask(user, profile);

      await activitiesDao.updateBulkSet([
        { id: task1._id, update: { sortOrder: 1 } },
        { id: task2._id, update: { sortOrder: 2 } }
      ]);

      const taskUpdated =  await activitiesDao.reload(task1);
      expect(taskUpdated.sortOrder).toEqual(1);

      const taskUpdated2 = await activitiesDao.reload(task2);
      expect(taskUpdated2.sortOrder).toEqual(2);
    });
  });

  describe('archive', () => {
    it('archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await activityData.createTask(user, profile);
      const result = await activitiesDao.archive(task);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(task);
      expect(refresh.archived).toEqual(true);
    });

    it('archive already archived task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await activityData.createTask(user, profile, null,{ archived: true });
      const result = await activitiesDao.archive(task);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(task);
      expect(refresh.archived).toEqual(true);
    });

    it('archive habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile);
      const result = await activitiesDao.archive(habit);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(habit);
      expect(refresh.archived).toEqual(true);
    });
  });

  describe('unarchive', () => {
    it('un-archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await activityData.createTask(user, profile, null, { archived: true });
      const result = await activitiesDao.unarchive(task);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(task);
      expect(refresh.archived).toEqual(false);
    });

    it('un-archive already un-archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await activityData.createTask(user, profile);
      const result = await activitiesDao.unarchive(task);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(task);
      expect(refresh.archived).toEqual(false);
    });

    it('un-archive habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createTask(user, profile,null, { archived: true });
      const result = await activitiesDao.unarchive(habit);
      expect(result).toEqual(true);
      const refresh = await activitiesDao.reload(habit);
      expect(refresh.archived).toEqual(false);
    });
  });

  describe('findByProfileAndPlan', () => {
    it('assure we do find multiple of the same type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile, { interval: CalendarIntervalEnum.Daily });
      const habit2 = await activityData.createHabit(user, profile,{ interval: CalendarIntervalEnum.Daily });

      const result = await activitiesDao.findByProfileAndInterval(profile, ActivityType.Habit, CalendarIntervalEnum.Daily);
      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
      expect(result.find(c => c.title === habit.title)).toBeDefined();
      expect(result.find(c => c.title === habit2.title)).toBeDefined();
    });

    it('assure we do not include an entry of another plan', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile,{ interval: CalendarIntervalEnum.Daily });
       await activityData.createHabit(user, profile,{ interval: CalendarIntervalEnum.Weekly });

      const result = await activitiesDao.findByProfileAndInterval(profile, ActivityType.Habit, CalendarIntervalEnum.Daily);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result.find(c => c.title === habit.title)).toBeDefined();
    });

    it('assure we do not include an entry of another type', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile, { interval: CalendarIntervalEnum.Daily });
      await activityData.createTask(user, profile, { interval: CalendarIntervalEnum.Daily });

      const result = await activitiesDao.findByProfileAndInterval(profile, ActivityType.Habit, CalendarIntervalEnum.Daily);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].title).toEqual(habit.title);
    });

    it('find with exclude', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile,{ interval: CalendarIntervalEnum.Daily });
      const habit2 = await activityData.createHabit(user, profile, { interval: CalendarIntervalEnum.Daily });

      const result = await activitiesDao.findByProfileAndInterval(profile, ActivityType.Habit, CalendarIntervalEnum.Daily, {
        excludeIds: habit._id
      });

      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result.find(c => c.title === habit2.title)).toBeDefined();
    });
  });
});
