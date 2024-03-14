import { buildTest, LyvelyTestingModule } from '@lyvely/testing';
import { ChartSeriesService } from './chart-series.service';
import { ChartsDao } from '../daos';
import { analyticsTestPlugin } from '../testing';
import { ContentDataType, Profile, ProfileTestDataUtils, User } from '@lyvely/api';
import { Chart, ChartSeriesConfig, GraphChartConfig } from '../schemas';
import { CalendarInterval } from '@lyvely/dates';
import {
  CHART_SERIES_TYPE_SCORE,
  CHART_SERIES_DEFINITION_SCORE,
  registerChartSeries,
} from '@lyvely/analytics-interface';

describe('ChartSeriesService', () => {
  let chartSeriesService: ChartSeriesService;
  let chartsDao: ChartsDao;
  let testingModule: LyvelyTestingModule;
  let testData: ProfileTestDataUtils;

  const TEST_KEY = 'habit_service';

  beforeEach(async () => {
    testingModule = await buildTest(TEST_KEY)
      .plugins([analyticsTestPlugin])
      .providers([ChartsDao, ChartSeriesService, ProfileTestDataUtils])
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

  async function createGraph(
    profile: Profile,
    user: User,
    series: ChartSeriesConfig[],
  ): Promise<Chart<GraphChartConfig>> {
    return chartsDao.save(
      new Chart<GraphChartConfig>(profile, user, {
        content: new ContentDataType({ title: 'Test' }),
        config: new GraphChartConfig({
          interval: CalendarInterval.Monthly,
          series,
        }),
      }),
    ) as Promise<Chart<GraphChartConfig>>;
  }

  describe('addSeries', () => {
    it('add score graph series', async () => {
      const { user, profile, context } = await testData.createUserAndProfile();
      registerChartSeries(CHART_SERIES_DEFINITION_SCORE);
      const chart = await createGraph(profile, user, []);
      expect(chart.config.series.length).toEqual(0);
      await chartSeriesService.addSeries(
        context,
        chart,
        new ChartSeriesConfig({
          type: CHART_SERIES_TYPE_SCORE,
          name: 'TestScore',
        }),
      );
      expect(chart.config.series.length).toEqual(1);
      const persisted = (await chartsDao.reload(chart)) as Chart<GraphChartConfig>;
      expect(persisted.config.series.length).toEqual(1);
      expect(persisted.config.series[0].name).toEqual('TestScore');
      expect(persisted.config.series[0].type).toEqual(CHART_SERIES_TYPE_SCORE);
    });
  });
});
