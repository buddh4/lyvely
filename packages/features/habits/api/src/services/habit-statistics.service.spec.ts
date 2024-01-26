import { HabitTestDataUtil, habitTestPlugin } from '../testing';
import { HabitDataPointService } from './habit-data-point.service';
import { HabitDataPointDao } from '../daos';
import { ContentScoreDao, ContentScoreService } from '@lyvely/api';
import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { HabitStatisticsService, StatisticAccumulation } from './habit-statistics.service';
import { CalendarInterval } from '@lyvely/dates';

describe('HabitDataPointService', () => {
  let habitDataPointService: HabitDataPointService;
  let habitStatisticsService: HabitStatisticsService;
  let testingModule: LyvelyTestingModule;
  let testData: HabitTestDataUtil;

  const TEST_KEY = 'habit_data_point_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([habitTestPlugin])
      .providers([
        HabitDataPointService,
        HabitDataPointDao,
        ContentScoreService,
        ContentScoreDao,
        HabitStatisticsService,
      ])
      .compile();
    habitDataPointService = testingModule.get(HabitDataPointService);
    testData = testingModule.get(HabitTestDataUtil);
    habitStatisticsService = testingModule.get(HabitStatisticsService);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  describe('aggregateHabitValues', () => {
    it('aggregate yearly data', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Yearly,
        max: 100,
      });

      await Promise.all([
        testData.createDataPoint(user, profile, habit, new Date('2017-10-10'), 17),
        testData.createDataPoint(user, profile, habit, new Date('2018-10-10'), 18),
        testData.createDataPoint(user, profile, habit, new Date('2019-10-10'), 19),
        testData.createDataPoint(user, profile, habit, new Date('2020-10-10'), 20),
        testData.createDataPoint(user, profile, habit, new Date('2021-10-10'), 21),
        testData.createDataPoint(user, profile, habit, new Date('2022-10-10'), 22),
        testData.createDataPoint(user, profile, habit, new Date('2023-10-10'), 23),
      ]);

      const result = await habitStatisticsService.aggregateHabitValues(profile, habit, {
        accumulation: StatisticAccumulation.Sum,
        interval: CalendarInterval.Yearly,
      });

      expect(result.length).toEqual(6);
    });
  });
});
