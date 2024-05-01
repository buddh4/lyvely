import { Injectable, Logger } from '@nestjs/common';
import {
  createObjectId,
  ProtectedProfileContext,
  FieldValidationException,
  IntegrityException,
  ProfileContext,
} from '@lyvely/api';
import { Chart, ChartSeriesConfig } from '../schemas';
import {
  ChartSeriesConfigModel,
  getChartSeriesDefinition,
  UpdateChartSeriesModel,
  ChartSeriesData,
  CHART_SERIES_PROFILE_SCORE,
  isTimeSeriesAggregationInterval,
} from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import type { IChartSeriesConfig } from '@lyvely/analytics-interface';
import { validate } from 'class-validator';
import { EventEmitter2 } from 'eventemitter2';
import { AnalyticsEvents, FetchSeriesDataEvent } from '../analytics.events';
import { OnEvent } from '@nestjs/event-emitter';
import { ProfileScoreAggregationService } from './profile-score-aggregation.service';

@Injectable()
export class ChartSeriesService {
  private logger = new Logger(ChartSeriesService.name);

  constructor(
    private readonly chartDao: ChartsDao,
    private readonly scoreAggregationService: ProfileScoreAggregationService,
    private readonly emitter: EventEmitter2,
  ) {}

  @OnEvent(AnalyticsEvents.EVENT_FETCH_SERIES_DATA)
  onFetchSeriesDataEvent(event: FetchSeriesDataEvent) {
    const { context, config, query } = event;

    if (event.isSeriesType(config, CHART_SERIES_PROFILE_SCORE.id)) {
      event.setResult(
        this.scoreAggregationService.aggregateProfileScoreSeries(context, {
          name: config.name,
          interval: isTimeSeriesAggregationInterval(query?.interval) ? query?.interval : undefined,
        }),
      );
    }
  }

  /**
   * Assembles all series data for a given chart.
   *
   * @param {ProfileContext} context The context object for the chart.
   * @param {Chart} chart The chart object for which to fetch the series data.
   * @param query Optional filter query.
   * @return {Promise<ChartSeriesData[]>} A promise that resolves to an array of ChartSeriesData objects.
   */
  async getSeriesData(
    context: ProfileContext,
    chart: Chart,
    query?: Record<string, string>,
  ): Promise<Record<string, ChartSeriesData[]>> {
    const result: Record<string, ChartSeriesData[]> = {};
    const fetchPromises: Promise<ChartSeriesData[]>[] = [];

    for (const config of chart.config.series) {
      fetchPromises.push(this.getSeriesDataByConfig(context, chart, config, query));
    }

    const allSeriesResults = await Promise.all(fetchPromises);
    allSeriesResults.forEach((seriesData, index) => {
      result[chart.config.series[index].id] = seriesData;
    });

    return result;
  }

  async getSeriesDataByConfig(
    context: ProfileContext,
    chart: Chart,
    config: ChartSeriesConfig,
    query?: Record<string, string>,
  ): Promise<ChartSeriesData[]> {
    const event = new FetchSeriesDataEvent(chart, context, config, query);
    this.emitter.emit(AnalyticsEvents.EVENT_FETCH_SERIES_DATA, event);
    const result = event.getResult();
    if (!result) {
      return [{ type: 'error', data: `Invalid Series Type ${config.type}`, name: config.name }];
    }

    return result.catch((e) => {
      this.logger.error(e, e.stack);
      return [
        {
          type: 'error',
          data: `An error occurred aggregating Series Type ${config.type}`,
          name: config.name,
        },
      ];
    });
  }

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
