import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { closeInMongodConnection } from '../../test/utils/mongoose-test.utils';
import { Model } from 'mongoose';
import { ProfileDocument } from '../../profiles';
import { ActivitiesDao } from '../daos/activities.dao';
import { UserDocument } from '../../users';
import { ActivityType , CalendarIntervalEnum, toTimingId, addDays, UserAssignmentStrategy } from '@lyvely/common';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { ActivityDocument, Habit, Task, UserDone } from '../schemas';
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
      expect(content instanceof Habit).toEqual(true);
    });
  });


  describe('findByProfileAndTimingIds', () => {
    it('find habit', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await activityData.createHabit(user, profile);
      const search = await activitiesDao.findByProfileAndTimingIds(profile, user,  []);
      expect(search.length).toEqual(1);
      expect(search.find(c => c.title === habit.title)).toBeDefined();
    });

    it('find undone task on user profile', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      await activityData.createTask(user, profile);

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, user,[todayTimingId]);
      expect(search.length).toEqual(1);
      expect(search[0].doneBy.length).toEqual(0);
    });

    it('find done task on user profile', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      await activityData.createTask(user, profile, {}, { doneBy: [new UserDone(user, todayTimingId, new Date())] });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, user,[todayTimingId]);
      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(user)).toEqual(true);
    });

    it('find undone shared task', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      await activityData.createTask(owner, profile, { userStrategy: UserAssignmentStrategy.Shared });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTimingId]);
      expect(search.length).toEqual(1);
      expect(search[0].doneBy.length).toEqual(0);
    });

    it('find shared task done by me', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.Shared,
      }, { doneBy: [new UserDone(member, todayTimingId, new Date())] });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTimingId]);

      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(member)).toEqual(true);
    });

    it('find shared task done by another user', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.Shared,
      }, { doneBy: [new UserDone(owner, todayTimingId, new Date())] });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTimingId]);

      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(owner)).toEqual(true);
    });

    it('do not find task done outside of tid search', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarIntervalEnum.Daily);
      const tomorrowTid = toTimingId(addDays(new Date() , 1), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.Shared,
      }, { doneBy: [new UserDone(owner, tomorrowTid, new Date())] });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTid]);

      expect(search.length).toEqual(0);
    });

    it('find undone per user task', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.PerUser,
      });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTid]);

      expect(search.length).toEqual(1);
    });

    it('find per user task done by me', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.PerUser,
      }, { doneBy: [new UserDone(member, todayTid, new Date())] });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTid]);
      expect(search.length).toEqual(1);
    });

    it('do not find per user task done by me outside of search tid', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarIntervalEnum.Daily);
      const tomorrowTid = toTimingId(addDays(new Date() , 1), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.PerUser,
      }, {
        doneBy: [
          new UserDone(member, tomorrowTid, new Date()),
          new UserDone(owner, todayTid, new Date())
        ]
      });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTid]);
      expect(search.length).toEqual(0);
    });

    it('find per user task not done by me but done by another user', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarIntervalEnum.Daily);

      const task = await activityData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.PerUser,
      }, {
        doneBy: [new UserDone(owner, todayTid, new Date())]
      });

      const search = <Task[]> await activitiesDao.findByProfileAndTimingIds(profile, member,[todayTid]);
      expect(search.length).toEqual(1);
    });
  });
   describe('updateBulk', () => {
     it('update multiple activities', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const task1 =  await activityData.createTask(user, profile);
       const task2 = await activityData.createTask(user, profile);

       await activitiesDao.updateSetBulk([
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
       const result = await activitiesDao.archive(profile, task);
       expect(result).toEqual(true);
       const refresh = await activitiesDao.reload(task);
       expect(refresh.archived).toEqual(true);
     });

     it('archive already archived task', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const task = await activityData.createTask(user, profile, null,{ archived: true });
       const result = await activitiesDao.archive(profile, task);
       expect(result).toEqual(true);
       const refresh = await activitiesDao.reload(task);
       expect(refresh.archived).toEqual(true);
     });

     it('archive habit', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const habit = await activityData.createHabit(user, profile);
       const result = await activitiesDao.archive(profile, habit);
       expect(result).toEqual(true);
       const refresh = await activitiesDao.reload(habit);
       expect(refresh.archived).toEqual(true);
     });
   });

   describe('unarchive', () => {
     it('un-archive task', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const task = await activityData.createTask(user, profile, null, { archived: true });
       const result = await activitiesDao.unarchive(profile, task);
       expect(result).toEqual(true);
       const refresh = await activitiesDao.reload(task);
       expect(refresh.archived).toEqual(false);
     });

     it('un-archive already un-archive task', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const task = await activityData.createTask(user, profile);
       const result = await activitiesDao.unarchive(profile, task);
       expect(result).toEqual(true);
       const refresh = await activitiesDao.reload(task);
       expect(refresh.archived).toEqual(false);
     });

     it('un-archive habit', async () => {
       const { user, profile } = await testData.createUserAndProfile();
       const habit = await activityData.createTask(user, profile,null, { archived: true });
       const result = await activitiesDao.unarchive(profile, habit);
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
