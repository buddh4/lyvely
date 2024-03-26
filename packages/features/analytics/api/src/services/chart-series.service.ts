import { Inject, Injectable, Logger } from '@nestjs/common';
import { ProtectedProfileContext, createObjectId } from '@lyvely/api';
import { Chart, ChartSeriesConfig } from '../schemas';
import {
  UpdateChartSeriesModel,
  getChartSeriesDefinition,
  ChartSeriesConfigModel,
} from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import { IntegrityException } from '@lyvely/interface';

@Injectable()
export class ChartSeriesService {
  protected logger = new Logger(ChartSeriesService.name);

  @Inject()
  protected chartDao: ChartsDao;

  /**
   * Adds a series to the given chart by update model.
   * The provided series needs to be compatible with the given chart type.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} chart - The chart to add the series to.
   * @param {UpdateChartSeriesModel} model - The series model to add.
   * @returns {Promise<void>} - A promise that resolves when the series has been added to the chart and the chart has been updated.
   */
  async addSeriesByUpdateModel(
    context: ProtectedProfileContext,
    chart: Chart,
    model: UpdateChartSeriesModel,
  ) {
    const series = this.createSeriesConfig(chart, model);
    return this.addSeries(context, chart, series);
  }

  /**
   * Adds a series to the given chart.
   * The provided series needs to be compatible with the given chart type.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} chart - The chart to add the series to.
   * @param {ChartSeriesConfig} series - The series document to add.
   * @returns {Promise<void>} - A promise that resolves when the series has been added to the chart and the chart has been updated.
   */
  async addSeries(context: ProtectedProfileContext, chart: Chart, series: ChartSeriesConfig) {
    this.validateSeriesTypeAgainstChart(chart, series);

    chart.addSeries(series);

    await this.chartDao.updateOneByProfileAndIdSet(context.profile, chart, {
      config: chart.config,
    });
  }

  /**
   * Validates whether the given series type is compatible with the chart type.
   *
   * @param {Chart} chart - The chart object that the series will be added to.
   * @param {ChartSeriesConfig} series - The series configuration object.
   * @throws {IntegrityException} - If the series type is not compatible with the chart type.
   */
  validateSeriesTypeAgainstChart(chart: Chart, series: ChartSeriesConfig) {
    const seriesDefinition = getChartSeriesDefinition(series.type);

    if (!seriesDefinition)
      throw new IntegrityException(
        `Attempt to add invalid series type ${series.type} to chart ${chart.config.category}`,
      );

    if (!seriesDefinition.chartTypes.includes(series.chartType))
      throw new IntegrityException(
        `Attempt to add incompatible series type ${series.type} to chart ${chart.config.category}`,
      );
  }

  /**
   * Creates the series configuration for the chart based on the provided model.
   *
   * @param {Chart} chart - The chart object.
   * @param {ChartSeriesConfig} model - The model object containing the series configuration details.
   * @throws {IntegrityException} If the chart series type is unknown.
   * @returns {ChartSeriesConfig} The created series configuration.
   */
  createSeriesConfig(chart: Chart, model: UpdateChartSeriesModel): ChartSeriesConfig {
    const seriesDefinition = getChartSeriesDefinition(model.config.type);

    if (!seriesDefinition)
      throw new IntegrityException(
        `Can not create series config for unknown series type ${model.config.type}`,
      );

    const ConfigType = seriesDefinition.configType || ChartSeriesConfigModel;

    const config = new ConfigType({ ...model.config });
    return { _id: createObjectId(), ...config };
  }
}
