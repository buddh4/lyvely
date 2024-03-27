import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  createObjectId,
  ProtectedProfileContext,
  FieldValidationException,
  IntegrityException,
} from '@lyvely/api';
import { Chart, ChartSeriesConfig } from '../schemas';
import {
  ChartSeriesConfigModel,
  getChartSeriesDefinition,
  UpdateChartSeriesModel,
  isValidChartTypeForCategory,
} from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import type { IChartSeriesConfig } from '@lyvely/analytics-interface';
import { validate } from 'class-validator';

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
    return this.addSeries(context, chart, model.config);
  }

  /**
   * Adds a series to the given chart.
   * The provided series needs to be compatible with the given chart type.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} chart - The chart to add the series to.
   * @param {IChartSeriesConfig} rawSeriesConfig - The series document to add.
   * @returns {Promise<void>} - A promise that resolves when the series has been added to the chart and the chart has been updated.
   */
  async addSeries(
    context: ProtectedProfileContext,
    chart: Chart,
    rawSeriesConfig: IChartSeriesConfig,
  ) {
    const seriesConfig = await this.createAndValidateSeriesConfig(chart, rawSeriesConfig);

    chart.addSeries({ ...seriesConfig, _id: createObjectId() });

    await this.chartDao.updateOneByProfileAndIdSet(context.profile, chart, {
      config: chart.config,
    });
  }

  /**
   * Validates whether the given series type is compatible with the chart type.
   *
   * @param {Chart} chart - The chart object that the series will be added to.
   * @param {ChartSeriesConfig} seriesConfig - The series configuration object.
   * @throws {IntegrityException} - If the series type is not compatible with the chart type.
   */
  async createAndValidateSeriesConfig(
    chart: Chart,
    seriesConfig: IChartSeriesConfig,
  ): Promise<ChartSeriesConfig> {
    seriesConfig = this.createSeriesConfigModel(seriesConfig);
    const seriesDefinition = getChartSeriesDefinition(seriesConfig.type);

    if (!seriesDefinition)
      throw new IntegrityException(`Attempt to add invalid series type ${seriesConfig.type}`);

    if (!seriesDefinition.chartTypes.includes(seriesConfig.chartType))
      throw new IntegrityException(
        `Attempt to add incompatible chart type ${seriesConfig.chartType} to chart ${chart.config.category}`,
      );

    if (!isValidChartTypeForCategory(seriesConfig.chartType, chart.config.category))
      throw new IntegrityException(
        `Attempt to add invalid chart type ${seriesConfig.chartType} to chart ${chart.config.category}`,
      );

    const errors = await validate(seriesConfig);
    if (errors.length) throw new FieldValidationException(errors);

    return { ...seriesConfig, _id: createObjectId() };
  }

  /**
   * Creates the series configuration for the chart based on the provided model.
   *
   * @param {IChartSeriesConfig} config - The model object containing the series configuration details.
   * @throws {IntegrityException} If the chart series type is unknown.
   * @returns {ChartSeriesConfig} The created series configuration.
   */
  createSeriesConfigModel(config: IChartSeriesConfig): ChartSeriesConfigModel {
    const seriesDefinition = getChartSeriesDefinition(config.type);

    if (!seriesDefinition)
      throw new IntegrityException(
        `Can not create series config for unknown series type ${config.type}`,
      );

    const ConfigType = seriesDefinition.configType || ChartSeriesConfigModel;

    return new ConfigType({ ...config });
  }
}
