import {
  LyvelyTestingModule,
  ContentDataType,
  Profile,
  ProfileTestDataUtils,
  User,
  buildProfileTest,
  getObjectId,
} from '@lyvely/api';
import { ChartsDao } from '../daos';
import { analyticsTestPlugin } from '../testing';
import {
  Chart,
  ChartSeriesConfig,
  TimeSeriesChartConfig,
  UserScoreChartSeriesConfig,
} from '../schemas';
import {
  CHART_SERIES_PROFILE_SCORE,
  registerChartSeries,
  TimeSeriesChartType,
} from '@lyvely/analytics-interface';

describe('ChartSeriesService', () => {
  let chartsDao: ChartsDao;
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([analyticsTestPlugin])
      .providers([ChartsDao])
      .compile();
    chartsDao = testingModule.get(ChartsDao);
    testData = testingModule.get(ProfileTestDataUtils);
    registerChartSeries(CHART_SERIES_PROFILE_SCORE);
  });

  afterEach(async () => {
    return testingModule.afterEach();
  });

  afterAll(async () => {
    return testingModule.afterAll();
  });

  it('service should exist', async () => {
    expect(chartsDao).toBeDefined();
  });

  async function createTimeSeriesChart(
    profile: Profile,
    user: User,
    series: ChartSeriesConfig[],
  ): Promise<Chart<TimeSeriesChartConfig>> {
    return chartsDao.save(
      new Chart<TimeSeriesChartConfig>(
        { profile, user },
        {
          content: new ContentDataType({ title: 'Test' }),
          config: new TimeSeriesChartConfig({ series }),
        },
      ),
    ) as Promise<Chart<TimeSeriesChartConfig>>;
  }

  describe('deleteSeries', () => {
    it('delete existing series', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const chart = await createTimeSeriesChart(profile, user, [
        new ChartSeriesConfig({
          type: CHART_SERIES_PROFILE_SCORE.id,
          name: 'OldName',
        }),
      ]);

      await chartsDao.deleteSeries(chart, chart.config.series[0]._id);
      const update = await chartsDao.reload(chart);

      expect(update!.config.series.length).toEqual(0);
      expect(chart.config.series.length).toEqual(0);
    });

    it('delete non existing series', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const chart = await createTimeSeriesChart(profile, user, [
        new ChartSeriesConfig({
          type: CHART_SERIES_PROFILE_SCORE.id,
          name: 'OldName',
        }),
      ]);

      await chartsDao.deleteSeries(chart, getObjectId('nonExisting'));
      const update = await chartsDao.reload(chart);

      expect(update!.config.series.length).toEqual(1);
      expect(chart.config.series.length).toEqual(1);
    });
  });

  describe('updateSeries', () => {
    it('update series config', async () => {
      const { user, profile } = await testData.createUserAndProfile();

      const chart = await createTimeSeriesChart(profile, user, [
        new ChartSeriesConfig({
          type: CHART_SERIES_PROFILE_SCORE.id,
          name: 'OldName',
        }),
      ]);

      const tagId = getObjectId('someTag');

      const series = chart.config.series[0];
      await chartsDao.updateSeries(
        chart,
        series,
        new UserScoreChartSeriesConfig({
          chartType: TimeSeriesChartType.Line,
          uids: [user._id],
          tagIds: [tagId],
          currentUser: true,
          name: 'NewName',
        }),
      );

      const existingConfig = chart.config.series[0] as UserScoreChartSeriesConfig;
      expect(existingConfig.name).toEqual('NewName');
      expect(existingConfig._id).toEqual(series._id);
      expect(existingConfig.uids).toEqual([user._id]);
      expect(existingConfig.currentUser).toEqual(true);
      expect(existingConfig.tagIds).toEqual([tagId]);

      const updated = await chartsDao.reload(chart);
      const seriesConfig = updated?.config.series[0] as UserScoreChartSeriesConfig;
      expect(seriesConfig.name).toEqual('NewName');
      expect(seriesConfig._id).toEqual(series._id);
      expect(seriesConfig.uids).toEqual([user._id]);
      expect(seriesConfig.currentUser).toEqual(true);
      expect(seriesConfig.tagIds).toEqual([tagId]);
    });
  });
});
