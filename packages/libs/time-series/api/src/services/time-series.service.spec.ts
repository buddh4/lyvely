import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { UserAssignmentStrategy } from '@lyvely/common';
import {
  DataPointValueType,
  CheckboxNumberDataPointConfig,
  getDataPointModelDefinition,
} from '../index';
import { CalendarInterval, subtractDays, toTimingId } from '@lyvely/dates';
import {
  TestDataPointDao,
  TestDataPointService,
  TestTimeSeriesContent,
  TestTimeSeriesContentSchema,
  TestTimeSeriesService,
  TestTimeSeriesContentDao,
} from '../testing';
import {
  Profile,
  profilesTestPlugin,
  ProfileTestDataUtils,
  User,
  Content,
  ContentSchema,
  contentTestPlugin,
  Model,
} from '@lyvely/api';

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

describe('TimeSeriesService', () => {
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: TestTimeSeriesService;
  let contentDao: TestTimeSeriesContentDao;
  let TestNumberTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'DataPointService';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, contentTestPlugin])
      .providers([
        TestDataPointDao,
        TestDataPointService,
        TestTimeSeriesContentDao,
        TestTimeSeriesService,
      ])
      .models(Models)
      .compile();
    testData = testingModule.get(ProfileTestDataUtils);
    service = testingModule.get(TestTimeSeriesService);
    contentDao = testingModule.get(TestTimeSeriesContentDao);
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

    const model = new TestTimeSeriesContent(profile, user, data as any);
    const entity = new TestNumberTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent(profile, user, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upsertDataPoint()', () => {
    it('update creates new summary entry', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.upsertDataPoint(profile, user, content, date, 5);
      const updatedContent = await contentDao.reload(content);

      expect(updatedContent!.timeSeriesSummary).toBeDefined();
      expect(updatedContent!.timeSeriesSummary.window?.length).toEqual(1);
      expect(updatedContent!.timeSeriesSummary.window[0].value).toEqual(5);
      expect(updatedContent!.timeSeriesSummary.window[0].tid).toEqual(
        toTimingId(date, CalendarInterval.Daily),
      );
    });

    it('out of window update does not creates new summary entry', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = subtractDays(new Date(), 100);

      await service.upsertDataPoint(profile, user, content, date, 5);
      const updatedContent = await contentDao.reload(content);

      expect(updatedContent!.timeSeriesSummary).toBeDefined();
      expect(updatedContent!.timeSeriesSummary.window?.length).toEqual(0);
    });

    it('boundary of window update creates new summary entry', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = subtractDays(new Date(), 6);

      await service.upsertDataPoint(profile, user, content, date, 5);
      const updatedContent = await contentDao.reload(content);

      expect(updatedContent!.timeSeriesSummary).toBeDefined();
      expect(updatedContent!.timeSeriesSummary.window?.length).toEqual(1);
      expect(updatedContent!.timeSeriesSummary.window[0].value).toEqual(5);
      expect(updatedContent!.timeSeriesSummary.window[0].tid).toEqual(
        toTimingId(date, CalendarInterval.Daily),
      );
    });

    it('summary window is sorted', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const today = new Date();
      const yesterday = subtractDays(today, 1);

      await service.upsertDataPoint(profile, user, content, today, 5);
      await service.upsertDataPoint(profile, user, content, yesterday, 3);
      const updatedContent = await contentDao.reload(content);

      expect(updatedContent!.timeSeriesSummary.window?.length).toEqual(2);
      expect(updatedContent!.timeSeriesSummary.window[0].tid).toEqual(
        toTimingId(yesterday, CalendarInterval.Daily),
      );
      expect(updatedContent!.timeSeriesSummary.window[1].tid).toEqual(
        toTimingId(today, CalendarInterval.Daily),
      );
    });
  });
});
