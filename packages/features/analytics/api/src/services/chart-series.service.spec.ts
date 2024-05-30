import {
  ILyvelyTestingModule,
  ContentDataType,
  ProfileTestDataUtils,
  buildProfileTest,
  ProtectedProfileContext,
} from '@lyvely/api';
import { ChartSeriesService } from './chart-series.service';
import { ChartsDao } from '../daos';
import { analyticsITestPlugin } from '../testing';
import { Chart, ChartSeriesConfig, TimeSeriesChartConfig } from '../schemas';
import { CHART_SERIES_PROFILE_SCORE, registerChartSeries } from '@lyvely/analytics-interface';
import { ProfileScoreAggregationService } from './profile-score-aggregation.service';

describe('ChartSeriesService', () => {
  let chartSeriesService: ChartSeriesService;
  let chartsDao: ChartsDao;
  let testingModule: ILyvelyTestingModule;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await buildProfileTest(TEST_KEY)
      .plugins([analyticsITestPlugin])
      .providers([
        ChartsDao,
        ChartSeriesService,
        ProfileScoreAggregationService,
        ProfileTestDataUtils,
      ])
      .compile();
    chartSeriesService = testingModule.get(ChartSeriesService);
    chartsDao = testingModule.get(ChartsDao);
    testData = testingModule.get(ProfileTestDataUtils);
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
    context: ProtectedProfileContext,
    series: ChartSeriesConfig[]
  ): Promise<Chart<TimeSeriesChartConfig>> {
    return chartsDao.save(
      new Chart<TimeSeriesChartConfig>(context, {
        content: new ContentDataType({ title: 'Test' }),
        config: new TimeSeriesChartConfig({ series }),
      })
    ) as Promise<Chart<TimeSeriesChartConfig>>;
  }

  describe('addSeries', () => {
    it('add score graph series', async () => {
      const { context } = await testData.createUserAndProfile();
      registerChartSeries(CHART_SERIES_PROFILE_SCORE);
      const chart = await createTimeSeriesChart(context, []);
      expect(chart.config.series.length).toEqual(0);
      await chartSeriesService.addSeries(
        context,
        chart,
        new ChartSeriesConfig({
          type: CHART_SERIES_PROFILE_SCORE.id,
          name: 'TestScore',
        })
      );
      expect(chart.config.series.length).toEqual(1);
      const persisted = (await chartsDao.reload(chart)) as Chart<TimeSeriesChartConfig>;
      expect(persisted.config.series.length).toEqual(1);
      expect(persisted.config.series[0].name).toEqual('TestScore');
      expect(persisted.config.series[0].type).toEqual(CHART_SERIES_PROFILE_SCORE.id);
    });
  });
});
