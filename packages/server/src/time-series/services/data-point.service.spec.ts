import { expect } from '@jest/globals';
import { TestingModule } from '@nestjs/testing';
import { createContentTestingModule, TestDataUtils } from '@/test';
import {
  CalendarInterval,
  CalendarPlanFilter,
  DataPointValueType,
  formatDate,
  toTimingId,
  UserAssignmentStrategy,
} from '@lyvely/common';
import {
  TestDataPointDao,
  TestDataPointService,
  TestTimeSeriesContent,
  TestTimeSeriesContentSchema,
} from '../test';
import { Content, ContentSchema } from '@/content';
import { Model } from 'mongoose';
import { CheckboxNumberDataPointConfig, getDataPointModelDefinition } from '@/time-series';
import { User } from '@/users';
import { Profile } from '@/profiles';
import { TestTimeSeriesService } from '@/time-series/test/test-time-series.service';
import { TestTimeSeriesContentDao } from '@/time-series/test/test-time-series-content.dao';

const Models = [
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [{ name: TestTimeSeriesContent.name, schema: TestTimeSeriesContentSchema }],
  },
  getDataPointModelDefinition(TestTimeSeriesContent.name, [
    DataPointValueType.Number,
    DataPointValueType.Timer,
  ]),
];

describe('DataPointService', () => {
  let testingModule: TestingModule;
  let testData: TestDataUtils;
  let service: TestDataPointService;
  // let dataPointService: TestDataPointService;
  let TestNumberTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await createContentTestingModule(
      TEST_KEY,
      [TestDataPointDao, TestDataPointService, TestTimeSeriesContentDao, TestTimeSeriesService],
      Models,
    ).compile();
    testData = testingModule.get(TestDataUtils);
    service = testingModule.get(TestDataPointService);
    TestNumberTimeSeriesContentModel = testingModule.get('TestTimeSeriesContentModel');
  });

  async function createTimeSeriesContent(
    user: User,
    profile: Profile,
    userStrategy: UserAssignmentStrategy = UserAssignmentStrategy.Shared,
  ) {
    const data = {
      someTestField: 'Testing...',
      config: {
        timeSeries: new CheckboxNumberDataPointConfig({
          min: 0,
          max: 5,
          optimal: 3,
          userStrategy: userStrategy,
          interval: CalendarInterval.Daily,
        }),
      },
    };

    const model = new TestTimeSeriesContent(profile, user, data as any);
    const entity = new TestNumberTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent(profile, user, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrCreateDataPoint()', () => {
    it('non existing log is created', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const { dataPoint } = await service.upsertDataPoint(profile, user, content, date, 5);
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
      const test = await service.findByIntervalLevel(profile, user, {
        date: formatDate(date),
        level: CalendarInterval.Unscheduled,
      });
      await service.upsertDataPoint(profile, user, content, date, 3);

      const test2 = await service.findByIntervalLevel(profile, user, {
        date: formatDate(date),
        level: CalendarInterval.Unscheduled,
      });
      const dataPoint = await service.findDataPointByDate(profile, user, content, date);
      expect(dataPoint.value).toEqual(3);
    });
  });

  describe('shared vs per user', () => {
    it('create per user strategy content', async () => {
      const { owner, member, profile } = await testData.createSimpleGroup();
      const date = new Date();
      const content = await createTimeSeriesContent(owner, profile, UserAssignmentStrategy.PerUser);
      const { dataPoint: ownerDataPoint } = await service.upsertDataPoint(
        profile,
        owner,
        content,
        date,
        1,
      );
      const { dataPoint: memberDataPoint } = await service.upsertDataPoint(
        profile,
        member,
        content,
        date,
        2,
      );

      expect(ownerDataPoint._id).not.toEqual(memberDataPoint._id);

      const filter = new CalendarPlanFilter(date);
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
      const content = await createTimeSeriesContent(owner, profile);
      const { dataPoint: ownerDataPoint } = await service.upsertDataPoint(
        profile,
        owner,
        content,
        date,
        1,
      );
      const { dataPoint: memberDataPoint } = await service.upsertDataPoint(
        profile,
        member,
        content,
        date,
        2,
      );

      expect(ownerDataPoint._id).toEqual(memberDataPoint._id);

      const filter = new CalendarPlanFilter(date);
      const ownerDataPoints = await service.findByIntervalLevel(profile, owner, filter);
      const memberDataPoints = await service.findByIntervalLevel(profile, member, filter);

      expect(ownerDataPoints.length).toEqual(1);
      expect(ownerDataPoints[0]._id).toEqual(memberDataPoints[0]._id);

      expect(memberDataPoints.length).toEqual(1);
      expect(memberDataPoints[0]._id).toEqual(ownerDataPoints[0]._id);
    });
  });
});
