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
    it('aggregate yearly data with yearly interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
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
        year: 2023,
      });

      expect(result.length).toEqual(6);
      expect(result[0]).toEqual({ _id: 2018, value: 18 });
      expect(result[1]).toEqual({ _id: 2019, value: 19 });
      expect(result[2]).toEqual({ _id: 2020, value: 20 });
      expect(result[3]).toEqual({ _id: 2021, value: 21 });
      expect(result[4]).toEqual({ _id: 2022, value: 22 });
      expect(result[5]).toEqual({ _id: 2023, value: 23 });
    });

    it('aggregate yearly data with monthly interval', async () => {
      const { user, profile } = await testData.createUserAndProfile();
      const habit = await testData.createHabit(user, profile, {
        interval: CalendarInterval.Monthly,
        max: 100,
      });

      await Promise.all([
        testData.createDataPoint(user, profile, habit, new Date('2017-10-10'), 10),
        testData.createDataPoint(user, profile, habit, new Date('2017-11-10'), 1),
        testData.createDataPoint(user, profile, habit, new Date('2018-10-10'), 20),
        testData.createDataPoint(user, profile, habit, new Date('2018-12-10'), 2),
        testData.createDataPoint(user, profile, habit, new Date('2019-10-10'), 30),
        testData.createDataPoint(user, profile, habit, new Date('2019-12-13'), 3),
        testData.createDataPoint(user, profile, habit, new Date('2020-1-1'), 40),
        testData.createDataPoint(user, profile, habit, new Date('2020-5-10'), 4),
        testData.createDataPoint(user, profile, habit, new Date('2021-8-8'), 50),
        testData.createDataPoint(user, profile, habit, new Date('2021-11-9'), 5),
        testData.createDataPoint(user, profile, habit, new Date('2022-10-10'), 60),
        testData.createDataPoint(user, profile, habit, new Date('2022-11-11'), 6),
        testData.createDataPoint(user, profile, habit, new Date('2023-10-10'), 70),
        testData.createDataPoint(user, profile, habit, new Date('2023-1-10'), 7),
      ]);

      const result = await habitStatisticsService.aggregateHabitValues(profile, habit, {
        accumulation: StatisticAccumulation.Sum,
        interval: CalendarInterval.Yearly,
        year: 2023,
      });

      expect(result.length).toEqual(6);
      expect(result[0]).toEqual({ _id: 2018, value: 22 });
      expect(result[1]).toEqual({ _id: 2019, value: 33 });
      expect(result[2]).toEqual({ _id: 2020, value: 44 });
      expect(result[3]).toEqual({ _id: 2021, value: 55 });
      expect(result[4]).toEqual({ _id: 2022, value: 66 });
      expect(result[5]).toEqual({ _id: 2023, value: 77 });
    });
  });
});
