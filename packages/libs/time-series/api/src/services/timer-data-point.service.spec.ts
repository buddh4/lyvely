import { ILyvelyTestingModule } from '@lyvely/api';
import {
  UserAssignmentStrategy,
  Profile,
  ProfileTestDataUtils,
  User,
  Content,
  ContentSchema,
  Model,
  buildContentTest,
} from '@lyvely/api';
import { DataPointValueType, getDataPointModelDefinition, TimerDataPointConfig } from '../index';
import { CalendarInterval } from '@lyvely/dates';
import {
  TestDataPointDao,
  TestDataPointService,
  TestTimeSeriesContent,
  TestTimeSeriesContentSchema,
  TestTimerDataPointService,
} from '../testing';

const Models = [
  {
    name: Content.name,
    collection: Content.collectionName(),
    schema: ContentSchema,
    discriminators: [{ name: TestTimeSeriesContent.name, schema: TestTimeSeriesContentSchema }],
  },
  getDataPointModelDefinition(TestTimeSeriesContent.name, [DataPointValueType.Timer]),
];

describe('TimerDataPointService', () => {
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: TestTimerDataPointService;
  // let dataPointService: TestDataPointService;
  let TestTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'NumberDataPointService';

  beforeEach(async () => {
    testingModule = await buildContentTest(TEST_KEY)
      .providers([TestDataPointDao, TestDataPointService, TestTimerDataPointService])
      .models(Models)
      .compile();
    testData = testingModule.get(ProfileTestDataUtils);
    service = testingModule.get(TestTimerDataPointService);
    TestTimeSeriesContentModel = testingModule.get('TestTimeSeriesContentModel');
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
    userStrategy: UserAssignmentStrategy = UserAssignmentStrategy.Shared
  ) {
    const data = {
      someTestField: 'Testing...',
      config: {
        timeSeries: new TimerDataPointConfig({
          min: 0,
          max: 5,
          optimal: 3,
          userStrategy: userStrategy,
          interval: CalendarInterval.Daily,
        }),
      },
    };

    const model = new TestTimeSeriesContent({ profile, user }, data as any);
    const entity = new TestTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent({ profile, user }, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startTimer()', () => {
    it('start new timer', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      const dataPoint = await service.startTimer(context, content, date);
      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(1);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });

    it('start already started timer', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.startTimer(context, content, date);
      const dataPoint = await service.startTimer(context, content, date);

      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(1);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });

    it('restart stopped timer', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const content = await createTimeSeriesContent(user, profile);
      const date = new Date();

      await service.startTimer(context, content, date);
      await service.stopTimer(context, content, date);
      const dataPoint = await service.startTimer(context, content, date);

      expect(dataPoint.timer).toBeDefined();
      expect(dataPoint.timer.spans.length).toEqual(2);
      expect(dataPoint.timer.isStarted()).toEqual(true);
    });
  });
});
