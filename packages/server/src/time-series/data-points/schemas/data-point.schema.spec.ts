import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { Model } from 'mongoose';
import { NumberDataPoint, NumberDataPointSchema } from '@/time-series';

const DataPointModelDefinition = [
  { name: NumberDataPoint.name, collection: 'testDataPoints', schema: NumberDataPointSchema },
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let TestNumberDataPointModel: Model<NumberDataPoint>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [],
      DataPointModelDefinition,
    ).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestNumberDataPointModel = testingModule.get<Model<NumberDataPoint>>('NumberDataPointModel');
  });

  afterEach(async () => {
    TestNumberDataPointModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
