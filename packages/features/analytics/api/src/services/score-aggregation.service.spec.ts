import {
  LyvelyTestingModule,
  ProfileTestDataUtils,
  buildProfileTest,
  ProfileScoreDao,
  ProfileScore,
  type ProtectedProfileContext,
} from '@lyvely/api';
import { analyticsTestPlugin } from '../testing';
import { ScoreAggregationService } from './score-aggregation.service';
import { ChartSeriesDataTypes } from '@lyvely/analytics-interface';

describe('ScoreAggregationService', () => {
  let scoreAggregationService: ScoreAggregationService;
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;
  let scoreDao: ProfileScoreDao;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([analyticsTestPlugin])
      .providers([ScoreAggregationService])
      .compile();
    scoreAggregationService = testingModule.get(ScoreAggregationService);
    scoreDao = testingModule.get(ProfileScoreDao);
    testData = testingModule.get(ProfileTestDataUtils);
  });

  afterEach(async () => {
    await scoreDao.deleteMany({});
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('service should exist', async () => {
    expect(scoreAggregationService).toBeDefined();
  });

  async function createScores(context: ProtectedProfileContext, scores: [number, Date][]) {
    return scoreDao.saveMany(
      scores.map(
        ([score, date]) =>
          new ProfileScore({
            user: context.user,
            profile: context.profile,
            score,
            date,
          }),
      ),
    );
  }

  describe('aggregateProfileScoreSeries', () => {
    it('aggregate empty score', async () => {
      const { context } = await testData.createUserAndProfile();
      const result = await scoreAggregationService.aggregateProfileScoreSeries(context);
      expect(result.length).toEqual(1);
      expect(result[0].type).toEqual(ChartSeriesDataTypes.KEYVALUE);
      expect(result[0].data.length).toEqual(0);
    });

    describe('7D', () => {
      it('Range check for 7D aggregation', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2024-04-17')],
          [1, new Date('2024-04-18')],
          [1, new Date('2024-04-24')],
          [1, new Date('2024-04-25')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '7D',
          endDate: new Date('2024-04-24'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2024, month: 4, day: 18 }, value: 1 },
          { key: { year: 2024, month: 4, day: 24 }, value: 1 },
        ]);
      });

      it('aggregate 7D scores', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2024-04-19')],
          [1, new Date('2024-04-19')],
          [1, new Date('2024-04-20')],
          [1, new Date('2024-04-20')],
          [1, new Date('2024-04-21')],
          [1, new Date('2024-04-21')],
          [1, new Date('2024-04-22')],
          [1, new Date('2024-04-22')],
          [1, new Date('2024-04-23')],
          [1, new Date('2024-04-23')],
          [1, new Date('2024-04-24')],
          [1, new Date('2024-04-24')],
          [1, new Date('2024-04-25')],
          [1, new Date('2024-04-25')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '7D',
          endDate: new Date('2024-04-25'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2024, month: 4, day: 19 }, value: 2 },
          { key: { year: 2024, month: 4, day: 20 }, value: 2 },
          { key: { year: 2024, month: 4, day: 21 }, value: 2 },
          { key: { year: 2024, month: 4, day: 22 }, value: 2 },
          { key: { year: 2024, month: 4, day: 23 }, value: 2 },
          { key: { year: 2024, month: 4, day: 24 }, value: 2 },
          { key: { year: 2024, month: 4, day: 25 }, value: 2 },
        ]);
      });
    });

    describe('1M', () => {
      it('Range check for 1M aggregation', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2024-03-23')],
          [1, new Date('2024-03-24')],
          [1, new Date('2024-04-24')],
          [1, new Date('2024-04-25')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '1M',
          endDate: new Date('2024-04-24'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2024, month: 3, day: 24 }, value: 1 },
          { key: { year: 2024, month: 4, day: 24 }, value: 1 },
        ]);
      });

      it('aggregate 1M scores', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2024-04-01')],
          [1, new Date('2024-04-01')],
          [1, new Date('2024-04-05')],
          [1, new Date('2024-04-05')],
          [1, new Date('2024-04-12')],
          [1, new Date('2024-04-12')],
          [1, new Date('2024-04-25')],
          [1, new Date('2024-04-25')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '1M',
          endDate: new Date('2024-04-25'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2024, month: 4, day: 1 }, value: 2 },
          { key: { year: 2024, month: 4, day: 5 }, value: 2 },
          { key: { year: 2024, month: 4, day: 12 }, value: 2 },
          { key: { year: 2024, month: 4, day: 25 }, value: 2 },
        ]);
      });
    });

    describe('6M', () => {
      it('Range check for 6M aggregation', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2023-10-31')],
          [1, new Date('2023-11-01')],
          [1, new Date('2024-04-30')],
          [1, new Date('2024-05-01')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '6M',
          endDate: new Date('2024-04-01'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2023, month: 11 }, value: 1 },
          { key: { year: 2024, month: 4 }, value: 1 },
        ]);
      });

      it('aggregate 6M scores', async () => {
        const { context } = await testData.createUserAndProfile();
        await createScores(context, [
          [1, new Date('2023-11-01')],
          [1, new Date('2023-11-02')],
          [1, new Date('2023-12-01')],
          [1, new Date('2023-12-02')],
          [1, new Date('2024-01-01')],
          [1, new Date('2024-01-02')],
          [1, new Date('2024-02-01')],
          [1, new Date('2024-02-02')],
          [1, new Date('2024-03-01')],
          [1, new Date('2024-03-02')],
          [1, new Date('2024-04-01')],
          [1, new Date('2024-04-02')],
        ]);

        const result = await scoreAggregationService.aggregateProfileScoreSeries(context, {
          interval: '6M',
          endDate: new Date('2024-04-25'),
        });

        expect(result[0].data).toEqual([
          { key: { year: 2023, month: 11 }, value: 2 },
          { key: { year: 2023, month: 12 }, value: 2 },
          { key: { year: 2024, month: 1 }, value: 2 },
          { key: { year: 2024, month: 2 }, value: 2 },
          { key: { year: 2024, month: 3 }, value: 2 },
          { key: { year: 2024, month: 4 }, value: 2 },
        ]);
      });
    });
  });
});
