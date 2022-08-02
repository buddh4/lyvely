import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { Model } from 'mongoose';
import {
  TestNumberDataPoint,
  TestNumberDataPointDocument,
  TestNumberDataPointSchema
} from './src/test-data-point.schema';
import { getObjectId } from 'mongo-seeding';
import { CalendarIntervalEnum } from 'lyvely-common';

const DataPointModelDefinition = [
  { name: TestNumberDataPoint.name, schema: TestNumberDataPointSchema }
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let TestNumberDataPointModel: Model<TestNumberDataPointDocument>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [], DataPointModelDefinition).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestNumberDataPointModel = testingModule.get<Model<TestNumberDataPointDocument>>('TestNumberDataPointModel');
  });

  afterEach(async () => {
    TestNumberDataPointModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
