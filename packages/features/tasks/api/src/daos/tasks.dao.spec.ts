import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { CalendarInterval, toTimingId, addDays } from '@lyvely/dates';
import { UserAssignmentStrategy } from '@lyvely/api';
import { Task, UserDone } from '../schemas';
import { TaskTestDataUtil, taskTestPlugin } from '../testing';
import { TasksDao } from '../daos';

describe('Tasks DAO', () => {
  let testingModule: LyvelyTestingModule;
  let tasksDao: TasksDao;
  let testData: TaskTestDataUtil;

  const TEST_KEY = 'tasks_dao';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([taskTestPlugin])
      .providers([TasksDao])
      .compile();
    tasksDao = testingModule.get(TasksDao);
    testData = testingModule.get(TaskTestDataUtil);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(tasksDao).toBeDefined();
  });

  describe('findByProfileAndTimingIds', () => {
    it('find undone task on user profile', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(user, profile);

      const search = <Task[]>(
        await tasksDao.findByProfileAndTimingIds(profile, user, [todayTimingId])
      );
      expect(search.length).toEqual(1);
      expect(search[0].doneBy.length).toEqual(0);
    });

    it('find done task on user profile', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const todayTimingId = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(user, profile, {}, (model) => {
        model.doneBy = [new UserDone(user, todayTimingId, new Date())];
      });

      const search = <Task[]>(
        await tasksDao.findByProfileAndTimingIds(profile, user, [todayTimingId])
      );
      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(user)).toEqual(true);
    });

    it('find undone shared task', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.Shared,
      });

      const search = <Task[]>(
        await tasksDao.findByProfileAndTimingIds(profile, member, [todayTimingId])
      );
      expect(search.length).toEqual(1);
      expect(search[0].doneBy.length).toEqual(0);
    });

    it('find shared task done by me', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(
        owner,
        profile,
        {
          userStrategy: UserAssignmentStrategy.Shared,
        },
        (model) => {
          model.doneBy = [new UserDone(member, todayTimingId, new Date())];
        },
      );

      const search = <Task[]>(
        await tasksDao.findByProfileAndTimingIds(profile, member, [todayTimingId])
      );

      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(member)).toEqual(true);
    });

    it('find shared task done by another user', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTimingId = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(
        owner,
        profile,
        {
          userStrategy: UserAssignmentStrategy.Shared,
        },
        (model) => {
          model.doneBy = [new UserDone(owner, todayTimingId, new Date())];
        },
      );

      const search = <Task[]>(
        await tasksDao.findByProfileAndTimingIds(profile, member, [todayTimingId])
      );

      expect(search.length).toEqual(1);
      expect(search[0].isDoneByUser(owner)).toEqual(true);
    });

    it('do not find task done outside of tid search', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarInterval.Daily);
      const tomorrowTid = toTimingId(addDays(new Date(), 1), CalendarInterval.Daily);

      const task = await testData.createTask(
        owner,
        profile,
        { userStrategy: UserAssignmentStrategy.Shared },
        (model) => {
          model.doneBy = [new UserDone(owner, tomorrowTid, new Date())];
        },
      );

      const search = <Task[]>await tasksDao.findByProfileAndTimingIds(profile, member, [todayTid]);

      expect(search.length).toEqual(0);
    });

    it('find undone per user task', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(owner, profile, {
        userStrategy: UserAssignmentStrategy.PerUser,
      });

      const search = <Task[]>await tasksDao.findByProfileAndTimingIds(profile, member, [todayTid]);

      expect(search.length).toEqual(1);
    });

    it('find per user task done by me', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(
        owner,
        profile,
        {
          userStrategy: UserAssignmentStrategy.PerUser,
        },
        (model) => {
          model.doneBy = [new UserDone(member, todayTid, new Date())];
        },
      );

      const search = <Task[]>await tasksDao.findByProfileAndTimingIds(profile, member, [todayTid]);
      expect(search.length).toEqual(1);
    });

    it('do not find per user task done by me outside of search tid', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarInterval.Daily);
      const tomorrowTid = toTimingId(addDays(new Date(), 1), CalendarInterval.Daily);

      await testData.createTask(
        owner,
        profile,
        {
          userStrategy: UserAssignmentStrategy.PerUser,
        },
        (model) => {
          model.doneBy = [
            new UserDone(member, tomorrowTid, new Date()),
            new UserDone(owner, todayTid, new Date()),
          ];
        },
      );

      const search = <Task[]>await tasksDao.findByProfileAndTimingIds(profile, member, [todayTid]);
      expect(search.length).toEqual(0);
    });

    it('find per user task not done by me but done by another user', async () => {
      const { member, owner, profile } = await testData.createSimpleGroup();
      const todayTid = toTimingId(new Date(), CalendarInterval.Daily);

      await testData.createTask(
        owner,
        profile,
        {
          userStrategy: UserAssignmentStrategy.PerUser,
        },
        (model) => {
          model.doneBy = [new UserDone(owner, todayTid, new Date())];
        },
      );

      const search = <Task[]>await tasksDao.findByProfileAndTimingIds(profile, member, [todayTid]);
      expect(search.length).toEqual(1);
    });
  });
  describe('updateBulk', () => {
    it('update multiple tasks', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task1 = await testData.createTask(user, profile);
      const task2 = await testData.createTask(user, profile);

      await tasksDao.updateSetBulk([
        { id: task1._id, update: { 'meta.sortOrder': 1 } },
        { id: task2._id, update: { 'meta.sortOrder': 2 } },
      ]);

      const taskUpdated = await tasksDao.reload(task1);
      expect(taskUpdated!.meta.sortOrder).toEqual(1);

      const taskUpdated2 = await tasksDao.reload(task2);
      expect(taskUpdated2!.meta.sortOrder).toEqual(2);
    });
  });

  describe('archive', () => {
    it('archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await testData.createTask(user, profile);
      const result = await tasksDao.archive(user, task);
      expect(result).toEqual(true);
      const refresh = await tasksDao.reload(task);
      expect(refresh!.meta.archived).toEqual(true);
    });

    it('archive already archived task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await testData.createTask(user, profile, {}, (model) => {
        model.meta.archived = true;
      });
      const result = await tasksDao.archive(user, task);
      expect(result).toEqual(true);
      const refresh = await tasksDao.reload(task);
      expect(refresh!.meta.archived).toEqual(true);
    });
  });

  describe('restore', () => {
    it('un-archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await testData.createTask(user, profile, {}, (model) => {
        model.meta.archived = true;
      });
      const result = await tasksDao.restore(user, task);
      expect(result).toEqual(true);
      const refresh = await tasksDao.reload(task);
      expect(refresh!.meta.archived).toEqual(false);
    });

    it('un-archive already un-archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await testData.createTask(user, profile);
      const result = await tasksDao.restore(user, task);
      expect(result).toEqual(true);
      const refresh = await tasksDao.reload(task);
      expect(refresh!.meta.archived).toEqual(false);
    });

    it('un-archive task', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const task = await testData.createTask(user, profile, {}, (model) => {
        model.meta.archived = true;
      });
      const result = await tasksDao.restore(user, task);
      expect(result).toEqual(true);
      const refresh = await tasksDao.reload(task);
      expect(refresh!.meta.archived).toEqual(false);
    });
  });
});
