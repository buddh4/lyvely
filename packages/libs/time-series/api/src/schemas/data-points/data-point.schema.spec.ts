import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { Model } from 'mongoose';
import { NumberDataPoint, NumberDataPointSchema } from '../index';
import { profilesTestPlugin } from '@lyvely/core';

const DataPointModelDefinition = [
  { name: NumberDataPoint.name, collection: 'testDataPoints', schema: NumberDataPointSchema },
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: LyvelyTestingModule;
  let TestNumberDataPointModel: Model<NumberDataPoint>;

  const TEST_KEY = 'NumberTimingDataPointSchema';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin])
      .models(DataPointModelDefinition)
      .compile();
    TestNumberDataPointModel = testingModule.get<Model<NumberDataPoint>>('NumberDataPointModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('should be defined', () => {
    expect(TestNumberDataPointModel).toBeDefined();
  });
});
