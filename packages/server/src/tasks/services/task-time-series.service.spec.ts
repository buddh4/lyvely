import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { DataPointIntervalFilter } from '@lyvely/common';
import { TaskTestDataUtil, createTaskTestingModule } from '../test';
import { TasksDao } from '../daos';
import { UserDone } from '../schemas';
import { TaskTimeSeriesService } from '@/tasks/services/task-time-series.service';

describe('TaskTimeSeriesService', () => {
  let testingModule: TestingModule;
  let taskTimeSeriesService: TaskTimeSeriesService;
  let testData: TaskTestDataUtil;

  const TEST_KEY = 'task_service';

  beforeEach(async () => {
    testingModule = await createTaskTestingModule(TEST_KEY, [
      TasksDao,
      TaskTimeSeriesService,
    ]).compile();
    taskTimeSeriesService = testingModule.get(TaskTimeSeriesService);
    testData = testingModule.get(TaskTestDataUtil);
  });

  afterEach(async () => {
    await testData.reset(TEST_KEY);
  });

  describe('findByFilter', () => {
    it('find undone task', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(user, profile);
      const filter = new DataPointIntervalFilter(new Date());
      const { models } = await taskTimeSeriesService.findByFilter(profile, user, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('find task done today within filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(user, profile, { title: 't1' }, (model) => {
        model.doneBy = [new UserDone(user, TaskTestDataUtil.getTodayTimingId())];
      });
      const filter = new DataPointIntervalFilter(new Date());
      const { models } = await taskTimeSeriesService.findByFilter(profile, user, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('find task done tomorrow within filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      const task = await testData.createTask(user, profile, { title: 't1' }, (model) => {
        model.doneBy = [new UserDone(user, TaskTestDataUtil.getTomorrowTimingId())];
      });
      const filter = new DataPointIntervalFilter(TaskTestDataUtil.getDateTomorrow());
      const { models } = await taskTimeSeriesService.findByFilter(profile, user, filter);
      expect(models.length).toEqual(1);
      expect(models[0].id).toEqual(task.id);
    });

    it('do not include tasks done outside of filter range', async () => {
      const { user, profile } = await testData.createUserAndProfile('user1');
      await testData.createTask(user, profile, { title: 't1' }, (model) => {
        model.doneBy = [new UserDone(user, TaskTestDataUtil.getTomorrowTimingId())];
      });
      const filter = new DataPointIntervalFilter(new Date());
      const { models } = await taskTimeSeriesService.findByFilter(profile, user, filter);
      expect(models.length).toEqual(0);
    });
  });
});
