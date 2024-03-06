import { registerChartSeries, resetChartSeries } from '../registries';
import { ChartType } from '../interfaces';
import { ChartSeriesConfigModel } from './chart-series-config.model';
import { Document, PartialPropertiesOf } from '@lyvely/common';
import { UpdateChartSeriesModel } from './update-chart-series.model';
import { Expose, plainToClass } from 'class-transformer';

class TestSeriesConfig<TID = string> extends ChartSeriesConfigModel<TID> {
  static seriesType = 'TestSeries';

  type = TestSeriesConfig.seriesType;

  @Expose()
  testField: string;

  constructor(data: PartialPropertiesOf<TestSeriesConfig<any>>) {
    super();
    Document.init(this, data);
  }
}

describe('UpdateChartSeriesModel', () => {
  afterEach(resetChartSeries);

  describe('transform', () => {
    it('transform of default chart series type works', () => {
      registerChartSeries({
        id: 'test',
        chartTypes: [ChartType.Graph],
      });
      const config = {
        id: 'testId',
        type: 'test',
        name: 'TestName',
      };
      const instance = plainToClass(UpdateChartSeriesModel, { config });
      expect(instance.config).toEqual(config);
    });

    it('invalid field is ignored', () => {
      const config = {
        id: 'testId',
        type: 'test2',
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
        chartTypes: [ChartType.Graph],
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
