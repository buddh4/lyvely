import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { CalendarInterval, toTimingId, UserAssignmentStrategy } from '@lyvely/common';
import { TasksService } from './tasks.service';
import { TaskTestDataUtil, createTaskTestingModule } from '../test';
import { TasksDao } from '../daos';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { Timer, TimeSpan } from '@/calendar';
import { Task } from '../schemas';

describe('TaskService', () => {
  let testingModule: TestingModule;
  let taskService: TasksService;
  let testData: TaskTestDataUtil;
  let taskDao: TasksDao;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await createTaskTestingModule(TEST_KEY, [TasksDao, TasksService]).compile();
    taskService = testingModule.get(TasksService);
    testData = testingModule.get(TaskTestDataUtil);
    taskDao = testingModule.get(TasksDao);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  async function createTask(
    profile: Profile,
    user: User,
    userStrategy: UserAssignmentStrategy,
    timers: Timer[] = [],
  ) {
    const task = await taskService.createContent(profile, user, {
      title: 'Do something!',
      score: 5,
      interval: CalendarInterval.Monthly,
      userStrategy: userStrategy,
    });

    await taskDao.updateOneSetById(task, { timers });
    return task;
  }

  it('create', async () => {
    const { user, profile } = await testData.createUserAndProfile();
    const task = await createTask(profile, user, UserAssignmentStrategy.Shared);
    expect(task.type).toBe(Task.name);
    expect(task.meta.sortOrder).toEqual(0);
    expect(task.meta.createdAt).toBeDefined();
    expect(task.meta.updatedAt).toBeDefined();
    expect(task.config.interval).toEqual(CalendarInterval.Monthly);
    expect(task.config.score).toEqual(5);
    expect(task.content.title).toEqual('Do something!');
    expect(task.doneBy).toEqual([]);
  });

  it('sortOrder creation', async () => {
    const { user, profile } = await testData.createUserAndProfile();
    const task1 = await createTask(profile, user, UserAssignmentStrategy.Shared);
    const task2 = await createTask(profile, user, UserAssignmentStrategy.Shared);
    expect(task1.meta.sortOrder).toEqual(0);
    expect(task2.meta.sortOrder).toEqual(1);
  });

  describe('setDone', () => {
    it('set done on shared task', async () => {
      const { owner, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

      await taskService.setDone(profile, owner, task, '2021-04-03');

      const search = await testData.findTaskById(task);
      expect(search.doneBy.length).toEqual(1);
      expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search.doneBy[0].uid).toEqual(owner._id);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.doneBy[0].uid).toEqual(owner._id);

      expect(profile.score).toEqual(5);
    });

    it('set multiple done on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, member, UserAssignmentStrategy.Shared);

      await taskService.setDone(profile, owner, task, '2021-04-03');
      await taskService.setDone(profile, member, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search.doneBy.length).toEqual(1);
      expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search.doneBy[0].uid).toEqual(member._id);

      expect(profile.score).toEqual(5);
    });

    it('set done on per-user task', async () => {
      const { owner, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

      await taskService.setDone(profile, owner, task, '2021-04-03');
      const search = await testData.findTaskById(task);
      expect(search.doneBy.length).toEqual(1);
      expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search.doneBy[0].uid).toEqual(owner._id);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.doneBy[0].uid).toEqual(owner._id);
    });

    it('set multiple done by on per-user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

      await taskService.setDone(profile, owner, task, '2021-04-03');
      await taskService.setDone(profile, member, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search.doneBy.length).toEqual(2);
      expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(search.doneBy[0].uid).toEqual(owner._id);
      expect(search.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search.doneBy[1].uid).toEqual(member._id);

      expect(task.doneBy.length).toEqual(2);
      expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.config.interval));
      expect(task.doneBy[0].uid).toEqual(owner._id);
      expect(task.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(task.doneBy[1].uid).toEqual(member._id);
    });

    it('set multiple done by single user on per-user task', async () => {
      const { owner, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

      await taskService.setDone(profile, owner, task, '2021-04-03');
      await taskService.setDone(profile, owner, task, '2021-04-05');

      const search = await testData.findTaskById(task);
      expect(search.doneBy.length).toEqual(1);
      expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(search.doneBy[0].uid).toEqual(owner._id);

      expect(task.doneBy.length).toEqual(1);
      expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.config.interval));
      expect(task.doneBy[0].uid).toEqual(owner._id);
    });
  });

  describe('setUndone', () => {
    it('set undone on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

      await taskService.setDone(profile, member, task, '2021-04-03');
      await taskService.setUndone(profile, member, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search.doneBy).toEqual([]);
      expect(task.doneBy).toEqual([]);
    });

    it('set undone by another user on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

      await taskService.setDone(profile, member, task, '2021-04-03');
      await taskService.setUndone(profile, owner, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search.doneBy).toEqual([]);
      expect(task.doneBy).toEqual([]);
    });

    it('set undone on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

      await taskService.setDone(profile, member, task, '2021-04-03');
      await taskService.setUndone(profile, member, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search.doneBy).toEqual([]);
      expect(task.doneBy).toEqual([]);
    });

    it('set undone on per user task with multiple doneBy', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

      await taskService.setDone(profile, member, task, '2021-04-03');
      await taskService.setDone(profile, owner, task, '2021-04-03');
      await taskService.setUndone(profile, member, task, '2021-04-03');

      const search = await testData.findTaskById(task.id);
      expect(search.doneBy.length).toEqual(1);
      expect(search.isDoneByUser(owner)).toEqual(true);
      expect(search.isDoneByUser(member)).toEqual(false);
      expect(task.doneBy.length).toEqual(1);
      expect(task.isDoneByUser(owner)).toEqual(true);
      expect(task.isDoneByUser(member)).toEqual(false);
    });
  });

  describe('startTimer', () => {
    it('start new timer on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
      const timer = await taskService.startTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(member).isStarted()).toEqual(true);
      expect(search.timers.length).toEqual(1);
    });

    it('start new timer on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
      const timer = await taskService.startTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(member)).toBeUndefined();
      expect(search.timers.length).toEqual(1);
    });

    it('start already started timer on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
      await taskService.startTimer(profile, owner, task);
      const timer = await taskService.startTimer(profile, member, task);

      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(member).isStarted()).toEqual(true);
      expect(search.timers.length).toEqual(1);
    });

    it('start already started timer on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
      await taskService.startTimer(profile, owner, task);
      const timer = await taskService.startTimer(profile, owner, task);

      expect(timer.isStarted()).toEqual(true);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(member)).toBeUndefined();
      expect(search.timers.length).toEqual(1);
    });

    it('start stopped timer on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer();
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000 }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared, [existingTimer]);

      expect(task.getTimer(owner)).not.toBeUndefined();
      expect(task.getTimer(owner).isStarted()).toEqual(false);

      await taskService.startTimer(profile, owner, task);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(member).isStarted()).toEqual(true);
      expect(search.getTimer(member).spans.length).toEqual(2);
      expect(search.timers.length).toEqual(1);
    });

    it('start stopped timer on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [
        existingTimer,
      ]);

      expect(task.getTimer(owner)).not.toBeUndefined();
      expect(task.getTimer(owner).isStarted()).toEqual(false);

      await taskService.startTimer(profile, owner, task);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(owner).spans.length).toEqual(2);
      expect(search.getTimer(member)).toBeUndefined();
      expect(search.timers.length).toEqual(1);
    });

    it('start multiple timers on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [
        existingTimer,
      ]);

      await taskService.startTimer(profile, owner, task);
      await taskService.startTimer(profile, member, task);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(true);
      expect(search.getTimer(owner).spans.length).toEqual(2);
      expect(search.getTimer(member).isStarted()).toEqual(true);
      expect(search.getTimer(member).spans.length).toEqual(1);
      expect(search.timers.length).toEqual(2);
    });
  });

  describe('stopTimer', () => {
    it('stop timer on shared task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, uid: owner._id }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared, [existingTimer]);
      const timer = await taskService.stopTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(false);
      expect(search.getTimer(member).isStarted()).toEqual(false);
      expect(search.timers.length).toEqual(1);
    });

    it('stop non existing timer on shared task', async () => {
      const { owner, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
      const timer = await taskService.stopTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner)).toBeUndefined();
    });

    it('stop non existing timer on per user task', async () => {
      const { owner, profile } = await testData.createSimpleGroup();

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
      const timer = await taskService.stopTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner)).toBeUndefined();
    });

    it('stop timer on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const existingTimer = new Timer(owner);
      existingTimer.spans = <Array<TimeSpan>>[{ from: start, to: start + 1000, uid: owner._id }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [
        existingTimer,
      ]);
      const timer = await taskService.stopTimer(profile, owner, task);
      expect(timer.isStarted()).toEqual(false);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(false);
      expect(search.getTimer(member)).toBeUndefined();
      expect(search.timers.length).toEqual(1);
    });

    it('stop two timer on per user task', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();

      const start = Date.now() - 1000 * 60 * 60;
      const ownerTimer = new Timer(owner);
      ownerTimer.spans = <Array<TimeSpan>>[{ from: start, uid: owner._id }];
      const memberTimer = new Timer(member);
      memberTimer.spans = <Array<TimeSpan>>[{ from: start, uid: member._id }];

      const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [
        ownerTimer,
        memberTimer,
      ]);
      await taskService.stopTimer(profile, owner, task);
      await taskService.stopTimer(profile, member, task);

      const search = await testData.findTaskById(task.id);
      expect(search.getTimer(owner).isStarted()).toEqual(false);
      expect(search.getTimer(member).isStarted()).toEqual(false);
      expect(search.timers.length).toEqual(2);
    });
  });
});
