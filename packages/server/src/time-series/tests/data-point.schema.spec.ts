import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { Model } from 'mongoose';
import {
  TestNumberDataPoint,
  TestNumberDataPointDocument,
  TestNumberDataPointSchema,
} from './src/test-data-point.schema';

const DataPointModelDefinition = [
  { name: TestNumberDataPoint.name, schema: TestNumberDataPointSchema },
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let TestNumberDataPointModel: Model<TestNumberDataPointDocument>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [],
      DataPointModelDefinition,
    ).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestNumberDataPointModel = testingModule.get<Model<TestNumberDataPointDocument>>(
      'TestNumberDataPointModel',
    );
  });

  afterEach(async () => {
    TestNumberDataPointModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
