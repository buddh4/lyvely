import { getChartSeriesConfigTypes, registerChartSeries, resetChartSeries } from '../registries';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { UpdateChartSeriesModel } from './update-chart-series.model';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { BaseModel, type BaseModelData } from '@lyvely/common';
import { TIME_SERIES_CHART } from './time-series-chart.category';

@Exclude()
class TestSeriesConfig extends ChartSeriesConfigModel {
  static seriesType = 'TestSeries';

  override type = TestSeriesConfig.seriesType;

  @Expose()
  testField: string;

  constructor(data: BaseModelData<TestSeriesConfig>) {
    super(false);
    BaseModel.init(this, data);
  }
}

describe('UpdateChartSeriesModel', () => {
  afterEach(resetChartSeries);

  describe('transform', () => {
    it('transform of default chart series type works', () => {
      registerChartSeries({
        id: TestSeriesConfig.seriesType,
        categoryTypes: [TIME_SERIES_CHART.id],
        configType: TestSeriesConfig,
      });
      const config = {
        testField: 'test',
        type: TestSeriesConfig.seriesType,
        name: 'TestName',
      };

      const instance = plainToClass(UpdateChartSeriesModel, { config });
      expect(instance.config).toEqual(config);
    });

    it('invalid field is ignored', () => {
      registerChartSeries({
        id: TestSeriesConfig.seriesType,
        categoryTypes: [TIME_SERIES_CHART.id],
        configType: TestSeriesConfig,
      });
      const config = {
        testField: 'test',
        type: TestSeriesConfig.seriesType,
        name: 'TestName',
      };
      const instance = plainToClass(UpdateChartSeriesModel, {
        config: { ...config, invalidField: 'invalid' },
      });

      expect((<any>instance.config).invalidField).toBeUndefined();
      expect(instance.config).toEqual(config);
    });

    it('additional config field of registered type is respected', () => {
      registerChartSeries({
        id: TestSeriesConfig.seriesType,
        configType: TestSeriesConfig,
        categoryTypes: [TIME_SERIES_CHART.id],
      });
      const config = {
        id: 'testId',
        type: TestSeriesConfig.seriesType,
        name: 'TestName',
        testField: 'valid',
      };
      const instance = plainToClass(UpdateChartSeriesModel, { config });
      expect((<any>instance.config).testField).toEqual('valid');
    });
  });
});
