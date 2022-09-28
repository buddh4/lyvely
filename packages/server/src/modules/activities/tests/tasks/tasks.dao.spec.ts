import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TestDataUtils } from '@/modules/test';
import { TaskDocument } from '../../schemas';
import { TasksDao } from '../../daos/tasks.dao';
import { createActivityTestingModule } from '../utils/activities.test.utils';

describe('Tasks DAO', () => {
  let testingModule: TestingModule;
  let TaskContentModel: Model<TaskDocument>;
  let tasksDao: TasksDao;
  let testData: TestDataUtils;

  const TEST_KEY = 'task_dao';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [TasksDao]).compile();
    TaskContentModel = testingModule.get<Model<TaskDocument>>('TaskModel');
    tasksDao = testingModule.get<TasksDao>(TasksDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
  });

  afterEach(async () => {
    await TaskContentModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(tasksDao).toBeDefined();
  });
});
