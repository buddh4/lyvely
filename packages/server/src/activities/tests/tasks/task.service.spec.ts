import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { ActivityType, CalendarIntervalEnum, toTimingId, UserAssignmentStrategy } from '@lyvely/common';
import { TasksService } from '../../services/tasks.service';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';
import { TasksDao } from '../../daos/tasks.dao';
import { ActivitiesDao } from '../../daos/activities.dao';
import { Task } from '../../schemas';
import { Profile } from '@/profiles';
import { User } from '@/users';
import { Timer } from '@/calendar';

describe('TaskService', () => {
  let testingModule: TestingModule;
  let taskService: TasksService;
  let testDataUtils: ActivityTestDataUtil;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [TasksDao, ActivitiesDao, TasksService]).compile();
    taskService = testingModule.get<TasksService>(TasksService);
    testDataUtils = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  async function createTask(profile: Profile, user: User, userStrategy: UserAssignmentStrategy, timers: Timer[] = []) {
    const task = Task.create(profile, user, {
      title: 'Do something!',
      score: 5,
      interval: CalendarIntervalEnum.Monthly,
      userStrategy: userStrategy,
    });
    task.timers = timers;
    return taskService.createContent(profile, user, task);
  }

  describe('Task service', () => {
    it('create', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const task = await createTask(profile, user, UserAssignmentStrategy.Shared);
      expect(task.type).toBe(ActivityType.Task);
      expect(task.meta.sortOrder).toEqual(0);
      expect(task.meta.createdAt).toBeDefined();
      expect(task.meta.updatedAt).toBeDefined();
      expect(task.dataPointConfig.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(task.score).toEqual(5);
      expect(task.data.title).toEqual('Do something!');
      expect(task.doneBy).toEqual([]);
    });

    it('sortOrder creation', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const task1 = await createTask(profile, user, UserAssignmentStrategy.Shared);
      const task2 = await createTask(profile, user, UserAssignmentStrategy.Shared);
      expect(task1.meta.sortOrder).toEqual(0);
      expect(task2.meta.sortOrder).toEqual(1);
    });

    describe('setDone', () => {
      it('set done on shared task', async () => {
        const { owner, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

        await taskService.setDone(profile, owner, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(1);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(owner._id);

        expect(task.doneBy.length).toEqual(1);
        expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(task.doneBy[0].uid).toEqual(owner._id);

        expect(profile.score).toEqual(5);
      });

      it('set multiple done on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, member, UserAssignmentStrategy.Shared);

        await taskService.setDone(profile, owner, task, '2021-04-03');
        await taskService.setDone(profile, member, task, '2021-04-05');

        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(1);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(member._id);

        expect(profile.score).toEqual(5);
      });

      it('set done on per-user task', async () => {
        const { owner, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

        await taskService.setDone(profile, owner, task, '2021-04-03');
        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(1);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(owner._id);

        expect(task.doneBy.length).toEqual(1);
        expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(task.doneBy[0].uid).toEqual(owner._id);
      });

      it('set multiple done by on per-user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

        await taskService.setDone(profile, owner, task, '2021-04-03');
        await taskService.setDone(profile, member, task, '2021-04-05');

        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(2);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(owner._id);
        expect(search.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(search.doneBy[1].uid).toEqual(member._id);

        expect(task.doneBy.length).toEqual(2);
        expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-03', task.dataPointConfig.interval));
        expect(task.doneBy[0].uid).toEqual(owner._id);
        expect(task.doneBy[1].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(task.doneBy[1].uid).toEqual(member._id);
      });

      it('set multiple done by single user on per-user task', async () => {
        const { owner, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

        await taskService.setDone(profile, owner, task, '2021-04-03');
        await taskService.setDone(profile, owner, task, '2021-04-05');

        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(1);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(owner._id);

        expect(task.doneBy.length).toEqual(1);
        expect(task.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(task.doneBy[0].uid).toEqual(owner._id);
      });
    });

    describe('setUndone', () => {
      it('set undone on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

        await taskService.setDone(profile, member, task, '2021-04-03');
        await taskService.setUndone(profile, member, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone by another user on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);

        await taskService.setDone(profile, member, task, '2021-04-03');
        await taskService.setUndone(profile, owner, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

        await taskService.setDone(profile, member, task, '2021-04-03');
        await taskService.setUndone(profile, member, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone on per user task with multiple doneBy', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);

        await taskService.setDone(profile, member, task, '2021-04-03');
        await taskService.setDone(profile, owner, task, '2021-04-03');
        await taskService.setUndone(profile, member, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
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
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
        const timer = await taskService.startTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(true);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(member).isStarted()).toEqual(true);
        expect(search.timers.length).toEqual(1);
      });

      it('start new timer on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
        const timer = await taskService.startTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(true);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(member)).toBeUndefined();
        expect(search.timers.length).toEqual(1);
      });

      it('start already started timer on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
        await taskService.startTimer(profile, owner, task);
        const timer = await taskService.startTimer(profile, member, task);

        expect(timer.isStarted()).toEqual(true);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(member).isStarted()).toEqual(true);
        expect(search.timers.length).toEqual(1);
      });

      it('start already started timer on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
        await taskService.startTimer(profile, owner, task);
        const timer = await taskService.startTimer(profile, owner, task);

        expect(timer.isStarted()).toEqual(true);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(member)).toBeUndefined();
        expect(search.timers.length).toEqual(1);
      });

      it('start stopped timer on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const existingTimer = new Timer();
        existingTimer.spans = [{ from: start, to: start + 1000 }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared, [existingTimer]);

        expect(task.getTimer(owner)).not.toBeUndefined();
        expect(task.getTimer(owner).isStarted()).toEqual(false);

        await taskService.startTimer(profile, owner, task);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(member).isStarted()).toEqual(true);
        expect(search.getTimer(member).spans.length).toEqual(2);
        expect(search.timers.length).toEqual(1);
      });

      it('start stopped timer on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const existingTimer = new Timer(owner);
        existingTimer.spans = [{ from: start, to: start + 1000, uid: owner._id }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [existingTimer]);

        expect(task.getTimer(owner)).not.toBeUndefined();
        expect(task.getTimer(owner).isStarted()).toEqual(false);

        await taskService.startTimer(profile, owner, task);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(owner).spans.length).toEqual(2);
        expect(search.getTimer(member)).toBeUndefined();
        expect(search.timers.length).toEqual(1);
      });

      it('start multiple timers on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const existingTimer = new Timer(owner);
        existingTimer.spans = [{ from: start, to: start + 1000, uid: owner._id }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [existingTimer]);

        await taskService.startTimer(profile, owner, task);
        await taskService.startTimer(profile, member, task);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(true);
        expect(search.getTimer(owner).spans.length).toEqual(2);
        expect(search.getTimer(member).isStarted()).toEqual(true);
        expect(search.getTimer(member).spans.length).toEqual(1);
        expect(search.timers.length).toEqual(2);
      });
    });

    describe('stopTimer', () => {
      it('stop timer on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const existingTimer = new Timer(owner);
        existingTimer.spans = [{ from: start, uid: owner._id }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared, [existingTimer]);
        const timer = await taskService.stopTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(false);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(false);
        expect(search.getTimer(member).isStarted()).toEqual(false);
        expect(search.timers.length).toEqual(1);
      });

      it('stop non existing timer on shared task', async () => {
        const { owner, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, owner, UserAssignmentStrategy.Shared);
        const timer = await taskService.stopTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(false);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner)).toBeUndefined();
      });

      it('stop non existing timer on per user task', async () => {
        const { owner, profile } = await testDataUtils.createSimpleGroup();

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser);
        const timer = await taskService.stopTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(false);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner)).toBeUndefined();
      });

      it('stop timer on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const existingTimer = new Timer(owner);
        existingTimer.spans = [{ from: start, to: start + 1000, uid: owner._id }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [existingTimer]);
        const timer = await taskService.stopTimer(profile, owner, task);
        expect(timer.isStarted()).toEqual(false);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(false);
        expect(search.getTimer(member)).toBeUndefined();
        expect(search.timers.length).toEqual(1);
      });

      it('stop two timer on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const start = Date.now() - 1000 * 60 * 60;
        const ownerTimer = new Timer(owner);
        ownerTimer.spans = [{ from: start, uid: owner._id }];
        const memberTimer = new Timer(member);
        memberTimer.spans = [{ from: start, uid: member._id }];

        const task = await createTask(profile, owner, UserAssignmentStrategy.PerUser, [ownerTimer, memberTimer]);
        await taskService.stopTimer(profile, owner, task);
        await taskService.stopTimer(profile, member, task);

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.getTimer(owner).isStarted()).toEqual(false);
        expect(search.getTimer(member).isStarted()).toEqual(false);
        expect(search.timers.length).toEqual(2);
      });
    });
  });
});
