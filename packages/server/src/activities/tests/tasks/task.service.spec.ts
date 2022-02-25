import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { buildTimingId, CalendarIntervalEnum, TimeSeriesRangeFilter , ActivityType } from 'lyvely-common';

import { TasksService } from '../../services/tasks.service';
import { ActivityDataPointService } from '../../services/activity-data-point.service';
import { ActivitiesService } from '../../services/activities.service';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';
import { TasksDao } from '../../daos/tasks.dao';
import { ActivitiesDao } from '../../daos/activities.dao';
import { Task } from '../../schemas';

describe('TaskService', () => {
  let testingModule: TestingModule;
  let taskService: TasksService;
  let activityService: ActivitiesService;
  let testDataUtils: ActivityTestDataUtil;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY,
      [TasksDao, ActivitiesDao, TasksService, ActivitiesService, ActivityDataPointService]).compile();
    activityService = testingModule.get<ActivitiesService>(ActivitiesService);
    taskService = testingModule.get<TasksService>(TasksService);
    testDataUtils = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await testDataUtils.reset(TEST_KEY);
  });

  describe('Task service', () => {
    it('create', async () => {
      const {user, profile} = await testDataUtils.createUserAndProfile();
      const task = await taskService.createContent(profile, Task.create(user, profile, {
        title: 'Do something!',
        value: 5,
        interval: CalendarIntervalEnum.Monthly
      }));

      expect(task.type).toBe(ActivityType.Task);
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
      expect(task.interval).toEqual(CalendarIntervalEnum.Monthly);
      expect(task.rating.min).toEqual(0);
      expect(task.rating.max).toEqual(1);
      expect(task.rating.value).toEqual(5);
      expect(task.title).toEqual('Do something!');
      expect(task.done).toBeUndefined();
    });

    describe('setDone', () => {
      it('no logs available', async () => {
        const {user, profile} = await testDataUtils.createUserAndProfile();
        const task = await testDataUtils.createTask(user, profile);
        await taskService.setDone(user, profile, task, '2021-04-03');
        const search = await testDataUtils.findTaskById(task.id);
        expect(search.done).toEqual(
          buildTimingId(task.interval, '2021-04-03', profile.locale),
        );
      });
    });

    describe('setUnDone', () => {
      it('no logs available', async () => {
        const {user, profile} = await testDataUtils.createUserAndProfile();
        const task = await testDataUtils.createTask(user, profile);
        await taskService.setDone(user, profile, task, '2021-04-03');
        await taskService.setUnDone(user, profile, task, '2021-04-03');
        const search = await testDataUtils.findTaskById(task.id);
        expect(search.done).toBeNull();
      });
    });

    describe('findTasksByRange', () => {
      it('no logs available', async () => {
        const {profile} = await testDataUtils.createUserAndProfile();

        const { logs } = await activityService.findByRangeFilter(
          profile,
          new TimeSeriesRangeFilter({
            from: '2021-04-03',
            to: '2021-04-04',
          }),
        );

        expect(logs.length).toEqual(0);
      });

      it('single undone task', async () => {
        const {user, profile} = await testDataUtils.createUserAndProfile();
        const task =  await testDataUtils.createTask(user, profile);

        const { activities } = await activityService.findByRangeFilter(
          profile,
          new TimeSeriesRangeFilter({from: '2021-04-03', to: '2021-04-04'}),
        );

        expect(activities.length).toEqual(1);
        expect(activities[0]._id).toEqual(task._id);
      });

      it('single done task within timing', async () => {
        const {user, profile} = await testDataUtils.createUserAndProfile();
        const task = await testDataUtils.createTask(user, profile);

        await taskService.setDone(user, profile, task, '2021-04-03');

        const { activities } = await activityService.findByRangeFilter(
          profile,
          new TimeSeriesRangeFilter({
            from: '2021-04-03',
            to: '2021-04-04',
          }),
        );

        expect(activities.length).toEqual(1);
        expect(activities[0]._id).toEqual(task._id);
      });

      it('single done task outside of search timing', async () => {
        const {user, profile} = await testDataUtils.createUserAndProfile();
        const task = await testDataUtils.createTask(user, profile);

        await taskService.setDone(user, profile, task, '2021-04-02');

        const { activities } = await activityService.findByRangeFilter(
          profile,
          new TimeSeriesRangeFilter({
            from: '2021-04-03',
            to: '2021-04-04',
          }),
        );

        expect(activities.length).toEqual(0);
      });
    });
  });
});
