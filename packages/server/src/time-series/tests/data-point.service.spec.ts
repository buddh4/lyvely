import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule, getObjectId } from '../../test/utils/test.utils';
import {
  TestNumberTimingDataPoint,
  TestNumberTimingDataPointPointSchema
} from './src/test-data-point.schema';
import {
  CalendarIntervalEnum,
  DeepPartial,
 DataPointIntervalFilter,
  toTimingId
} from 'lyvely-common';
import { TestNumberDataPointDao } from './src/test-data-point.dao';
import { TestNumberDataPointService } from "./src/test-data-point.service";
import {
  TestTimeSeriesContent,
  TestTimeSeriesContentDocument,
  TestTimeSeriesContentSchema
} from "./src/test-time-series-content.schema";
import { Content, ContentSchema } from "../../content";
import { Model } from 'mongoose';
import { CheckboxNumberDataPointConfig } from "../schemas";
import { User } from "../../users";
import { Profile } from "../../profiles";

const Models = [
  { name: TestNumberTimingDataPoint.name, schema: TestNumberTimingDataPointPointSchema },
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [
      { name: TestTimeSeriesContent.name, schema: TestTimeSeriesContentSchema },
    ],
  }
];

describe('DataPointService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let service: TestNumberDataPointService;
  let dao: TestNumberDataPointDao;
  let TestTimeSeriesContentModel: Model<TestTimeSeriesContentDocument>;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [TestNumberDataPointService, TestNumberDataPointDao], Models).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    service = testingModule.get<TestNumberDataPointService>(TestNumberDataPointService);
    dao = testingModule.get<TestNumberDataPointDao>(TestNumberDataPointDao);
    TestTimeSeriesContentModel = testingModule.get<Model<TestTimeSeriesContentDocument>>('TestTimeSeriesContentModel');
  });

  afterEach(async () => {
    await dao.deleteAll();
    await testData.reset(TEST_KEY);
  });

  async function createTimeSeriesContent(user: User, profile: Profile, data?: DeepPartial<TestTimeSeriesContent>) {
    data = data || {
      someTestField: 'Testing...',
      interval: CalendarIntervalEnum.Daily,
      dataPointConfig: new CheckboxNumberDataPointConfig({ min: 0, max: 5, optimal: 3 })
    };

    const model = new TestTimeSeriesContent(user, profile, data);
    const entity = new TestTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent(user, profile, entity);
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateLog()', () => {
    it('non existing log is created', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const log = await service.updateOrCreateDataPoint(profile, user, content, date, 5);
      expect(log._id).toBeDefined();
      expect(log.tid).toEqual(toTimingId(date));
      expect(log.value).toEqual(5);
    });

    it('update existing log value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.updateOrCreateDataPoint(profile, user, content, date, 5);
      await service.updateOrCreateDataPoint(profile, user, content, date, 3);
      const log = await service.findOrCreateLogByDay(profile, user, content, date);
      expect(log.value).toEqual(3);
    });
  });



  // TODO: Add log (merge times, validate value)
  // TODO: Test change content interval (align intervals of data point buckets)
  // TODO: Test cid access
});
