import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createTestingModule } from '../../test/utils/test.utils';
import mongoose, { Model } from 'mongoose';
import {
  TestNumberTimingDataPoint,
  TestNumberTimingDataPointDocument,
  TestNumberTimingDataPointPointSchema
} from './src/test-data-point.schema';
import { getObjectId } from 'mongo-seeding';
import { CalendarIntervalEnum } from 'lyvely-common/src';
import { createTid } from './src/test-data-point.dao';

const DataPointModelDefinition = [
  { name: TestNumberTimingDataPoint.name, schema: TestNumberTimingDataPointPointSchema }
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let TestNumberTimingDataPointModel: Model<TestNumberTimingDataPointDocument>;

  const TEST_KEY = 'TimeableContentSchema';

  beforeEach(async () => {
    testingModule = await createTestingModule(TEST_KEY, [], DataPointModelDefinition).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestNumberTimingDataPointModel = testingModule.get<Model<TestNumberTimingDataPointDocument>>('TestNumberTimingDataPointModel');

  });

  afterEach(async () => {
    TestNumberTimingDataPointModel.deleteMany({});
    await testData.reset(TEST_KEY);
  });

  it('should be defined', () => {
    expect(TestNumberTimingDataPointModel).toBeDefined();
  });
  // mongoose.set('debug', true);
  describe('save()', () => {
    it('save simple data point', async () => {
      const entity = new TestNumberTimingDataPointModel({
        meta: {
          pid: getObjectId('p1'),
          cid: getObjectId('p2'),
          uid: getObjectId('u1'),
          interval: CalendarIntervalEnum.Daily
        },
        tid: 'y:2022;q:1;m:2;w:7;d:20',
        value: 2,
        times: [{ seconds: 1000, value: 2 }]
      });

      await entity.save();
      expect(entity.id).toBeDefined();
    });
  });
});