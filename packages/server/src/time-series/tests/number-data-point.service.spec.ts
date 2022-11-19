import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, TestDataUtils } from '@/test';
import { TestNumberDataPoint, TestNumberDataPointSchema } from './src/test-data-point.schema';
import {
  CalendarIntervalEnum,
  DeepPartial,
  DataPointIntervalFilter,
  toTimingId,
  UserAssignmentStrategy,
} from '@lyvely/common';
import { TestNumberDataPointDao } from './src/test-number-data-point.dao';
import { TestNumberDataPointService } from './src/test-number-data-point.service';
import {
  TestNumberTimeSeriesContent,
  TestNumberTimeSeriesContentDocument,
  TestNumberTimeSeriesContentSchema,
  TestTimeSeriesContent,
} from './src/test-time-series-content.schema';
import { Content, ContentSchema } from '@/content';
import { Model } from 'mongoose';
import { CheckboxNumberDataPointConfig } from '../schemas';
import { User } from '@/users';
import { Profile } from '@/profiles';

const Models = [
  { name: TestNumberDataPoint.name, schema: TestNumberDataPointSchema },
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [{ name: TestNumberTimeSeriesContent.name, schema: TestNumberTimeSeriesContentSchema }],
  },
];

describe('NumberDataPointService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let service: TestNumberDataPointService;
  let dao: TestNumberDataPointDao;
  let TestNumberTimeSeriesContentModel: Model<TestNumberTimeSeriesContentDocument>;

  const TEST_KEY = 'NumberDataPointService';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [TestNumberDataPointService, TestNumberDataPointDao],
      Models,
    ).compile();
    testData = testingModule.get<TestDataUtils>(TestDataUtils);
    service = testingModule.get<TestNumberDataPointService>(TestNumberDataPointService);
    dao = testingModule.get<TestNumberDataPointDao>(TestNumberDataPointDao);
    TestNumberTimeSeriesContentModel = testingModule.get<Model<TestNumberTimeSeriesContentDocument>>(
      'TestNumberTimeSeriesContentModel',
    );
  });

  afterEach(async () => {
    await dao.deleteAll();
    await testData.reset(TEST_KEY);
  });

  async function createTimeSeriesContent(user: User, profile: Profile, data: DeepPartial<TestTimeSeriesContent> = {}) {
    data.someTestField = data.someTestField || 'Testing...';
    data.dataPointConfig =
      data.dataPointConfig ||
      new CheckboxNumberDataPointConfig({
        min: 0,
        max: 5,
        optimal: 3,
        interval: data.dataPointConfig?.interval ?? CalendarIntervalEnum.Daily,
      });

    const model = new TestNumberTimeSeriesContent(profile, user, data as any);
    const entity = new TestNumberTimeSeriesContentModel(model);
    await entity.save();
    return new TestNumberTimeSeriesContent(profile, user, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrCreateDataPoint()', () => {
    it('non existing log is created', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const dataPoint = await service.upsertDataPoint(profile, user, content, date, 5);
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.pid).toEqual(profile._id);
      expect(dataPoint.pid).toEqual(profile._id);
      expect(dataPoint.tid).toEqual(toTimingId(date));
      expect(dataPoint.value).toEqual(5);
    });

    it('update existing log value', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, user, content, date, 5);
      await service.upsertDataPoint(profile, user, content, date, 3);
      const dataPoint = await service.findDataPointByDate(profile, user, content, date);
      expect(dataPoint.value).toEqual(3);
    });
  });

  describe('shared vs per user', () => {
    it('create per user strategy content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const date = new Date();
      const content = await createTimeSeriesContent(owner, profile, { userStrategy: UserAssignmentStrategy.PerUser });
      const ownerDataPoint = await service.upsertDataPoint(profile, owner, content, date, 1);
      const memberDataPoint = await service.upsertDataPoint(profile, member, content, date, 2);

      expect(ownerDataPoint._id).not.toEqual(memberDataPoint._id);

      const filter = new DataPointIntervalFilter(date);
      const ownerDataPoints = await service.findByIntervalLevel(profile, owner, filter);
      const memberDataPoints = await service.findByIntervalLevel(profile, member, filter);

      expect(ownerDataPoints.length).toEqual(1);
      expect(ownerDataPoints[0]._id).toEqual(ownerDataPoint._id);
      expect(ownerDataPoints[0].value).toEqual(1);

      expect(memberDataPoints.length).toEqual(1);
      expect(memberDataPoints[0]._id).toEqual(memberDataPoint._id);
      expect(memberDataPoints[0].value).toEqual(2);
    });

    it('create shared user strategy content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const date = new Date();
      const content = await createTimeSeriesContent(owner, profile, { userStrategy: UserAssignmentStrategy.Shared });
      const ownerDataPoint = await service.upsertDataPoint(profile, owner, content, date, 1);
      const memberDataPoint = await service.upsertDataPoint(profile, member, content, date, 2);

      expect(ownerDataPoint._id).toEqual(memberDataPoint._id);

      const filter = new DataPointIntervalFilter(date);
      const ownerDataPoints = await service.findByIntervalLevel(profile, owner, filter);
      const memberDataPoints = await service.findByIntervalLevel(profile, member, filter);

      expect(ownerDataPoints.length).toEqual(1);
      expect(ownerDataPoints[0]._id).toEqual(memberDataPoints[0]._id);

      expect(memberDataPoints.length).toEqual(1);
      expect(memberDataPoints[0]._id).toEqual(ownerDataPoints[0]._id);
    });
  });

  describe('startTimer()', () => {
    it('start new timer', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const dataPoint = await service.startTimer(profile, user, content, date);
      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(1);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });

    it('start already started timer', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.startTimer(profile, user, content, date);
      const dataPoint = await service.startTimer(profile, user, content, date);

      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(1);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });

    it('restart stopped timer', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.startTimer(profile, user, content, date);
      await service.stopTimer(profile, user, content, date);
      const dataPoint = await service.startTimer(profile, user, content, date);

      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(2);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });
  });
});
