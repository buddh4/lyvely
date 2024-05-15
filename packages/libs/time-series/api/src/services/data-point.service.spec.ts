import { ILyvelyTestingModule } from '@lyvely/testing';
import {
  UserAssignmentStrategy,
  User,
  Content,
  ContentSchema,
  Profile,
  ProfileTestDataUtils,
  Model,
  buildContentTest,
} from '@lyvely/api';
import {
  DataPointValueType,
  CheckboxNumberDataPointConfig,
  getDataPointModelDefinition,
} from '../index';
import { CalendarPlanFilter } from '@lyvely/calendar-plan';
import { CalendarInterval, formatDate, toTimingId } from '@lyvely/dates';
import {
  TestDataPointDao,
  TestDataPointService,
  TestTimeSeriesContent,
  TestTimeSeriesContentSchema,
  TestTimeSeriesService,
  TestTimeSeriesContentDao,
} from '../testing';

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
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: TestDataPointService;
  let TestNumberTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .providers([
        TestDataPointDao,
        TestDataPointService,
        TestTimeSeriesContentDao,
        TestTimeSeriesService,
      ])
      .models(Models)
      .compile();
    testData = testingModule.get(ProfileTestDataUtils);
    service = testingModule.get(TestDataPointService);
    TestNumberTimeSeriesContentModel = testingModule.get('TestTimeSeriesContentModel');
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
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

    const model = new TestTimeSeriesContent({ profile, user }, data as any);
    const entity = new TestNumberTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent({ profile, user }, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateOrCreateDataPoint()', () => {
    it('non existing log is created', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const { dataPoint } = await service.upsertDataPoint(context, content, date, 5);
      expect(dataPoint._id).toBeDefined();
      expect(dataPoint.pid).toEqual(profile._id);
      expect(dataPoint.pid).toEqual(profile._id);
      expect(dataPoint.tid).toEqual(toTimingId(date));
      expect(dataPoint.value).toEqual(5);
    });

    it('update existing log value', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(context, content, date, 5);
      await service.findByIntervalLevel(context, {
        date: formatDate(date),
        level: CalendarInterval.Unscheduled,
      });
      await service.upsertDataPoint(context, content, date, 3);

      await service.findByIntervalLevel(context, {
        date: formatDate(date),
        level: CalendarInterval.Unscheduled,
      });
      const dataPoint = await service.findDataPointByDate(context, content, date);
      expect(dataPoint!.value).toEqual(3);
    });
  });

  describe('shared vs per user', () => {
    it('create per user strategy content', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();
      const date = new Date();
      const content = await createTimeSeriesContent(owner, profile, UserAssignmentStrategy.PerUser);
      const { dataPoint: ownerDataPoint } = await service.upsertDataPoint(
        ownerContext,
        content,
        date,
        1,
      );
      const { dataPoint: memberDataPoint } = await service.upsertDataPoint(
        memberContext,
        content,
        date,
        2,
      );

      expect(ownerDataPoint._id).not.toEqual(memberDataPoint._id);

      const filter = new CalendarPlanFilter(date);
      const ownerDataPoints = await service.findByIntervalLevel(ownerContext, filter);
      const memberDataPoints = await service.findByIntervalLevel(memberContext, filter);

      expect(ownerDataPoints.length).toEqual(1);
      expect(ownerDataPoints[0]._id).toEqual(ownerDataPoint._id);
      expect(ownerDataPoints[0].value).toEqual(1);

      expect(memberDataPoints.length).toEqual(1);
      expect(memberDataPoints[0]._id).toEqual(memberDataPoint._id);
      expect(memberDataPoints[0].value).toEqual(2);
    });

    it('create shared user strategy content', async () => {
      const { owner, ownerContext, member, memberContext, profile } =
        await testData.createSimpleGroup();
      const date = new Date();
      const content = await createTimeSeriesContent(owner, profile);
      const { dataPoint: ownerDataPoint } = await service.upsertDataPoint(
        ownerContext,
        content,
        date,
        1,
      );
      const { dataPoint: memberDataPoint } = await service.upsertDataPoint(
        memberContext,
        content,
        date,
        2,
      );

      expect(ownerDataPoint._id).toEqual(memberDataPoint._id);

      const filter = new CalendarPlanFilter(date);
      const ownerDataPoints = await service.findByIntervalLevel(ownerContext, filter);
      const memberDataPoints = await service.findByIntervalLevel(memberContext, filter);

      expect(ownerDataPoints.length).toEqual(1);
      expect(ownerDataPoints[0]._id).toEqual(memberDataPoints[0]._id);

      expect(memberDataPoints.length).toEqual(1);
      expect(memberDataPoints[0]._id).toEqual(ownerDataPoints[0]._id);
    });
  });
});
