import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { UserAssignmentStrategy } from '@lyvely/common';
import { DataPointValueType, getDataPointModelDefinition, TimerDataPointConfig } from '../index';
import { CalendarInterval } from '@lyvely/dates';
import {
  TestDataPointDao,
  TestDataPointService,
  TestTimeSeriesContent,
  TestTimeSeriesContentSchema,
  TestTimerDataPointService,
} from '../testing';
import {
  Profile,
  profilesTestPlugin,
  ProfileTestDataUtils,
  User,
  Content,
  ContentSchema,
  contentTestPlugin,
} from '@lyvely/core';
import { Model } from 'mongoose';

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
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let service: TestTimerDataPointService;
  // let dataPointService: TestDataPointService;
  let TestTimeSeriesContentModel: Model<TestTimeSeriesContent>;

  const TEST_KEY = 'NumberDataPointService';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([profilesTestPlugin, contentTestPlugin])
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
    userStrategy: UserAssignmentStrategy = UserAssignmentStrategy.Shared,
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

    const model = new TestTimeSeriesContent(profile, user, data as any);
    const entity = new TestTimeSeriesContentModel(model);
    await entity.save();
    return new TestTimeSeriesContent(profile, user, entity.toObject());
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
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
