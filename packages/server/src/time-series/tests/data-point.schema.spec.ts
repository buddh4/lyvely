import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { Model } from 'mongoose';
import {
  TestNumberDataPoint,
  TestNumberDataPointDocument,
  TestNumberDataPointPointSchema
} from './src/test-data-point.schema';
import { getObjectId } from 'mongo-seeding';
import { CalendarIntervalEnum } from 'lyvely-common';

const DataPointModelDefinition = [
  { name: TestNumberDataPoint.name, schema: TestNumberDataPointPointSchema }
];

describe('NumberTimingDataPointSchema', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let TestNumberTimingDataPointModel: Model<TestNumberDataPointDocument>;

  const TEST_KEY = 'TimeableContentSchema';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [], DataPointModelDefinition).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    TestNumberTimingDataPointModel = testingModule.get<Model<TestNumberDataPointDocument>>('TestNumberTimingDataPointModel');
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
      const entity = new TestNumberTimingDataPointModel(new TestNumberDataPoint({
        meta: {
          pid: getObjectId('p1'),
          cid: getObjectId('p2'),
          uid: getObjectId('u1'),
          interval: CalendarIntervalEnum.Daily
        },
        date: new Date(),
        value: 2,
        times: [{ ts: Date.now(), value: 2 }]
      }));

      await entity.save();
      expect(entity.id).toBeDefined();
    });
  });
});
