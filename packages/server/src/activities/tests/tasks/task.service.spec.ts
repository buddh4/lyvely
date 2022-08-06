import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { CalendarIntervalEnum, ActivityType, toTimingId, UserAssignmentStrategy } from '@lyvely/common';
import { TasksService } from '../../services/tasks.service';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';
import { TasksDao } from '../../daos/tasks.dao';
import { ActivitiesDao } from '../../daos/activities.dao';
import { Task } from '../../schemas';

describe('TaskService', () => {
  let testingModule: TestingModule;
  let taskService: TasksService;
  let testDataUtils: ActivityTestDataUtil;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY,
      [TasksDao, ActivitiesDao, TasksService]).compile();
    taskService = testingModule.get<TasksService>(TasksService);
    testDataUtils = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  describe('Task service', () => {
    it('create', async () => {
      const { user, profile } = await testDataUtils.createUserAndProfile();
      const t = Task.create(profile, user,{
        title: 'Do something!',
        score: 5,
        interval: CalendarIntervalEnum.Monthly,
        userStrategy: UserAssignmentStrategy.Shared,
      });
      const task = await taskService.createContent(profile, user, Task.create(profile, user,{
        title: 'Do something!',
        score: 5,
        interval: CalendarIntervalEnum.Monthly,
        userStrategy: UserAssignmentStrategy.Shared,
      }));

      expect(task.type).toBe(ActivityType.Task);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
      expect(task.dataPointConfig.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(task.score).toEqual(5);
      expect(task.title).toEqual('Do something!');
      expect(task.doneBy).toEqual([]);
    });

    describe('setDone', () => {
      it('set done on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.Shared,
        }));

        await taskService.setDone(owner, profile, task, '2021-04-03');

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

        const task = await taskService.createContent(profile, member, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.Shared,
        }));

        await taskService.setDone(owner, profile, task, '2021-04-03');
        await taskService.setDone(member, profile, task, '2021-04-05');

        const search = await testDataUtils.findTaskById(task);
        expect(search.doneBy.length).toEqual(1);
        expect(search.doneBy[0].tid).toEqual(toTimingId('2021-04-05', task.dataPointConfig.interval));
        expect(search.doneBy[0].uid).toEqual(member._id);

        expect(profile.score).toEqual(5);
      });

      it('set done on per-user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.PerUser,
        }));

        await taskService.setDone(owner, profile, task, '2021-04-03');
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

        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.PerUser,
        }));

        await taskService.setDone(owner, profile, task, '2021-04-03');
        await taskService.setDone(member, profile, task, '2021-04-05');

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
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();

        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.PerUser,
        }));

        await taskService.setDone(owner, profile, task, '2021-04-03');
        await taskService.setDone(owner, profile, task, '2021-04-05');

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
        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.Shared,
        }));

        await taskService.setDone(member, profile, task, '2021-04-03');
        await taskService.setUndone(member, profile, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone by another user on shared task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.Shared,
        }));

        await taskService.setDone(member, profile, task, '2021-04-03');
        await taskService.setUndone(owner, profile, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone on per user task', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.PerUser,
        }));

        await taskService.setDone(member, profile, task, '2021-04-03');
        await taskService.setUndone(member, profile, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy).toEqual([]);
        expect(task.doneBy).toEqual([]);
      });

      it('set undone on per user task with multiple doneBy', async () => {
        const { owner, member, profile } = await testDataUtils.createSimpleGroup();
        const task = await taskService.createContent(profile, owner, Task.create(profile, owner, {
          title: 'Do something!',
          score: 5,
          interval: CalendarIntervalEnum.Monthly,
          userStrategy: UserAssignmentStrategy.PerUser,
        }));

        await taskService.setDone(member, profile, task, '2021-04-03');
        await taskService.setDone(owner, profile, task, '2021-04-03');
        await taskService.setUndone(member, profile, task, '2021-04-03');

        const search = await testDataUtils.findTaskById(task.id);
        expect(search.doneBy.length).toEqual(1);
        expect(search.isDoneByUser(owner)).toEqual(true);
        expect(search.isDoneByUser(member)).toEqual(false);
        expect(task.doneBy.length).toEqual(1);
        expect(task.isDoneByUser(owner)).toEqual(true);
        expect(task.isDoneByUser(member)).toEqual(false);
      });
    });
  });
});
