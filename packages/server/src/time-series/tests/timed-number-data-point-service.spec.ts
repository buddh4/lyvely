import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { TestDataUtils } from '../../test/utils/test-data.utils';
import { createContentTestingModule } from '../../test/utils/test.utils';
import { TestTimedNumberDataPoint, TestTimedNumberDataPointPointSchema } from './src/test-data-point.schema';
import {
  CalendarIntervalEnum,
  DeepPartial,
  DataPointIntervalFilter
} from 'lyvely-common';
import { TestTimedNumberDataPointDao } from './src/test-number-data-point.dao';
import { TestTimedNumberDataPointService } from "./src/test-number-data-point.service";
import {
  TestNumberTimeSeriesContent,
  TestNumberTimeSeriesContentDocument, TestNumberTimeSeriesContentSchema,
  TestTimeSeriesContent,
} from "./src/test-time-series-content.schema";
import { Content, ContentSchema } from "../../content";
import { Model } from 'mongoose';
import { CheckboxNumberDataPointConfig } from "../schemas";
import { User } from "../../users";
import { Profile } from "../../profiles";

const Models = [
  { name: TestTimedNumberDataPoint.name, schema: TestTimedNumberDataPointPointSchema },
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [
      { name: TestNumberTimeSeriesContent.name, schema: TestNumberTimeSeriesContentSchema },
    ],
  }
];

describe('NumberDataPointService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let service: TestTimedNumberDataPointService;
  let dao: TestTimedNumberDataPointDao;
  let TestNumberTimeSeriesContentModel: Model<TestNumberTimeSeriesContentDocument>;

  const TEST_KEY = 'NumberDataPointService';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(TEST_KEY, [TestTimedNumberDataPointService, TestTimedNumberDataPointDao], Models).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    service = testingModule.get<TestTimedNumberDataPointService>(TestTimedNumberDataPointService);
    dao = testingModule.get<TestTimedNumberDataPointDao>(TestTimedNumberDataPointDao);
    TestNumberTimeSeriesContentModel = testingModule.get<Model<TestNumberTimeSeriesContentDocument>>('TestNumberTimeSeriesContentModel');
  });

  afterEach(async () => {
    await dao.deleteAll();
    await testData.reset(TEST_KEY);
  });

  async function createTimeSeriesContent(user: User, profile: Profile, data: DeepPartial<TestTimeSeriesContent> = {}) {
    data.someTestField = data.someTestField || 'Testing...';
    data.interval = data.interval ?? CalendarIntervalEnum.Daily;
    data.dataPointConfig = data.dataPointConfig || new CheckboxNumberDataPointConfig({ min: 0, max: 5, optimal: 3 });

    const model = new TestNumberTimeSeriesContent(user, profile, data);
    const entity = new TestNumberTimeSeriesContentModel(model);
    await entity.save();
    return new TestNumberTimeSeriesContent(user, profile, entity);
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrCreateDataPoint()', () => {
    it('create single datapoint', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const dataPoint = await service.upsertDataPoint(profile, user, content, date, 5);
      expect(dataPoint.value).toEqual(5);
      expect(dataPoint.history).toBeDefined();
      expect(dataPoint.history.length).toEqual(1);
      expect(dataPoint.history[0].value).toEqual(5);

      const dataPoints = await service.findByIntervalLevel(profile, user, new DataPointIntervalFilter(date));
      expect(dataPoints.length).toEqual(1);
      expect(dataPoints[0]._id).toEqual(dataPoint._id);
      expect(dataPoints[0].value).toEqual(5);
      expect(dataPoints[0].history).toBeDefined();
      expect(dataPoints[0].history.length).toEqual(1);
      expect(dataPoints[0].history[0].value).toEqual(5);
    });

    it('update newValue < oldValue', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, user, content, date, 5);
      const dataPoint = await service.upsertDataPoint(profile, user, content, date, 2);

      expect(dataPoint.value).toEqual(2);
      expect(dataPoint.history).toBeDefined();
      expect(dataPoint.history.length).toEqual(2);
      expect(dataPoint.history[0].value).toEqual(5);
      expect(dataPoint.history[1].value).toEqual(-3);

      const dataPoints = await service.findByIntervalLevel(profile, user, new DataPointIntervalFilter(date));
      expect(dataPoints.length).toEqual(1);
      expect(dataPoints[0]._id).toEqual(dataPoint._id);
      expect(dataPoints[0].value).toEqual(2);
      expect(dataPoints[0].history).toBeDefined();
      expect(dataPoints[0].history.length).toEqual(2);
      expect(dataPoints[0].history[0].value).toEqual(5);
      expect(dataPoints[0].history[1].value).toEqual(-3);
    });

    it('update newValue > oldValue', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, user, content, date, 2);
      const dataPoint = await service.upsertDataPoint(profile, user, content, date, 5);

      expect(dataPoint.value).toEqual(5);
      expect(dataPoint.history).toBeDefined();
      expect(dataPoint.history.length).toEqual(2);
      expect(dataPoint.history[0].value).toEqual(2);
      expect(dataPoint.history[1].value).toEqual(3);

      const dataPoints = await service.findByIntervalLevel(profile, user, new DataPointIntervalFilter(date));
      expect(dataPoints.length).toEqual(1);
      expect(dataPoints[0]._id).toEqual(dataPoint._id);
      expect(dataPoints[0].value).toEqual(5);
      expect(dataPoints[0].history).toBeDefined();
      expect(dataPoints[0].history.length).toEqual(2);
      expect(dataPoints[0].history[0].value).toEqual(2);
      expect(dataPoints[0].history[1].value).toEqual(3);
    });

    it('update newValue = oldValue', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, user, content, date, 5);
      const dataPoint = await service.upsertDataPoint(profile, user, content, date, 5);

      expect(dataPoint.value).toEqual(5);
      expect(dataPoint.history.length).toEqual(1);
    });

    it('updates by other user', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const content = await createTimeSeriesContent(owner, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, owner, content, date, 2);
      const dataPoint = await service.upsertDataPoint(profile, member, content, date, 3);

      expect(dataPoint.history[0].uid).toEqual(owner._id);
      expect(dataPoint.history[1].uid).toEqual(member._id);
    })
  });
});
