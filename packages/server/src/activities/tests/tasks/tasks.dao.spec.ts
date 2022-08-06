import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { TestDataUtils } from '../../../test/utils/test-data.utils';
import { CalendarIntervalEnum, toTimingId } from '@lyvely/common';
import { TaskDocument, } from '../../schemas';
import { TasksDao } from '../../daos/tasks.dao';
import { ActivityTestDataUtil, createActivityTestingModule } from '../utils/activities.test.utils';

describe('Tasks DAO', () => {
  let testingModule: TestingModule;
  let TaskContentModel: Model<TaskDocument>;
  let tasksDao: TasksDao;
  let testData: TestDataUtils;
  let activityData: ActivityTestDataUtil;

  const TEST_KEY = 'task_dao';

  beforeEach(async () => {
    testingModule = await createActivityTestingModule(TEST_KEY, [TasksDao]).compile();
    TaskContentModel = testingModule.get<Model<TaskDocument>>('TaskModel');
    tasksDao = testingModule.get<TasksDao>(TasksDao);
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    activityData = testingModule.get<ActivityTestDataUtil>(ActivityTestDataUtil);
  });

  afterEach(async () => {
    await TaskContentModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(tasksDao).toBeDefined();
  });
});
