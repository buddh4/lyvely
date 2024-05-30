import { Injectable, Logger } from '@nestjs/common';
import {
  createObjectId,
  ProtectedProfileContext,
  FieldValidationException,
  IntegrityException,
  ProfileContext,
  type TObjectId,
  type DocumentIdentity,
  assureStringId,
  type SortResult,
  assureObjectId,
  type QuerySort,
} from '@lyvely/api';
import {
  Chart,
  ChartSeriesConfig,
  UserScoreChartSeriesConfig,
  ProfileScoreChartSeriesConfig,
} from '../schemas';
import {
  ChartSeriesConfigModel,
  getChartSeriesDefinition,
  ChartSeriesData,
  CHART_SERIES_PROFILE_SCORE,
  isTimeSeriesAggregationInterval,
  CHART_SERIES_USER_SCORE,
  IChartSeriesConfig,
} from '@lyvely/analytics-interface';
import { ChartsDao } from '../daos';
import { validate } from 'class-validator';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { AnalyticsEvents, FetchSeriesDataEvent } from '../analytics.events';
import { ProfileScoreAggregationService } from './profile-score-aggregation.service';

@Injectable()
export class ChartSeriesService {
  private logger = new Logger(ChartSeriesService.name);

  constructor(
    private readonly chartDao: ChartsDao,
    private readonly scoreAggregationService: ProfileScoreAggregationService,
    private readonly emitter: EventEmitter2
  ) {}

  @OnEvent(AnalyticsEvents.EVENT_FETCH_SERIES_DATA)
  onFetchSeriesDataEvent(event: FetchSeriesDataEvent) {
    const { context, config, query } = event;

    if (event.isSeriesType<ProfileScoreChartSeriesConfig>(config, CHART_SERIES_PROFILE_SCORE.id)) {
      event.setResult(
        this.scoreAggregationService.aggregateProfileScoreSeries(context, {
          name: config.name,
          color: config.color,
          tagIds: config.tagIds,
          interval: isTimeSeriesAggregationInterval(query?.interval) ? query?.interval : undefined,
        })
      );
    }

    if (event.isSeriesType<UserScoreChartSeriesConfig>(config, CHART_SERIES_USER_SCORE.id)) {
      const user = event.context.user;
      const uids: TObjectId[] = [...(config.uids || [])];
      if (config.currentUser && user) uids.push(user._id);

      if (!uids.length) {
        return event.setResult(Promise.resolve([]));
      }

      event.setResult(
        this.scoreAggregationService.aggregateProfileScoreSeries(context, {
          name: config.name,
          uids,
          tagIds: config.tagIds,
          interval: isTimeSeriesAggregationInterval(query?.interval) ? query?.interval : undefined,
        })
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
    query?: Record<string, string>
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
    query?: Record<string, string>
  ): Promise<ChartSeriesData[]> {
    const event = new FetchSeriesDataEvent(chart, context, config, query);
    this.emitter.emit(AnalyticsEvents.EVENT_FETCH_SERIES_DATA, event);
    const result = event.getResult();
    if (!result) {
      return [{ type: 'error', data: `Invalid Series Type ${config.type}`, name: '' }];
    }

    return result.catch((e) => {
      this.logger.error(e, e.stack);
      return [
        {
          type: 'error',
          data: `An error occurred aggregating Series Type ${config.type}`,
          name: '',
        },
      ];
    });
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
    rawSeriesConfig: IChartSeriesConfig
  ) {
    const seriesConfig = await this.createAndValidateSeriesConfig(chart, rawSeriesConfig);

    const sid = createObjectId();
    chart.addSeries({ ...seriesConfig, _id: sid, id: assureStringId(sid) });

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
    seriesConfig: IChartSeriesConfig
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
        `Can not create series config for unknown series type ${config.type}`
      );

    const ConfigType = seriesDefinition.configType || ChartSeriesConfigModel;

    return new ConfigType({ ...config });
  }

  /**
   * Updates a series in a given chart.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} chart - The chart where the series needs to be updated.
   * @param {DocumentIdentity<ChartSeriesConfig>} sid - The identifier of the series to be updated.
   * @param {IChartSeriesConfig} rawSeriesConfig - The new configuration for the series.
   *
   * @return {Promise<void>} - A promise that resolves when the series is successfully updated.
   */
  async updateSeries(
    context: ProtectedProfileContext,
    chart: Chart,
    sid: DocumentIdentity<ChartSeriesConfig>,
    rawSeriesConfig: IChartSeriesConfig
  ) {
    const seriesConfig = await this.createAndValidateSeriesConfig(chart, rawSeriesConfig);
    return this.chartDao.updateSeries(chart, sid, seriesConfig);
  }

  /**
   * Deletes a series in a given chart.
   *
   * @param {ProtectedProfileContext} context - The protected profile context.
   * @param {Chart} chart - The chart where the series needs to be updated.
   * @param {DocumentIdentity<ChartSeriesConfig>} sid - The identifier of the series to be updated.
   *
   * @return {Promise<void>} - A promise that resolves when the series is successfully updated.
   */
  async deleteSeries(
    context: ProtectedProfileContext,
    chart: Chart,
    sid: DocumentIdentity<ChartSeriesConfig>
  ) {
    return this.chartDao.deleteSeries(chart, sid);
  }

  /**
   * Re-sorts the given time series content entries by means of the new index and updates the sortOrder of other activities with the same
   * calendar plan accordingly.
   *
   * @param context
   * @param model
   * @param attachToId
   * @throws ForbiddenServiceException
   */
  async sort(
    context: ProtectedProfileContext,
    model: Chart,
    attachToId?: DocumentIdentity<Chart>
  ): Promise<SortResult[]> {
    const { profile } = context;

    const attachToObjectId = attachToId ? assureObjectId(attachToId) : undefined;

    if (attachToObjectId && model._id.equals(attachToObjectId)) {
      return Promise.resolve([]);
    }

    const attachTo = attachToObjectId
      ? await this.chartDao.findByProfileAndId(profile, attachToObjectId)
      : undefined;

    if (attachTo && model.type !== attachTo.type) {
      throw new IntegrityException('Can not sort different content types');
    }

    const allDocs = await this.chartDao.findAllByProfile(profile, {
      excludeIds: model._id,
      sort: { 'meta.sortOrder': 1 } as QuerySort<Chart>,
    });

    const newIndex = attachTo ? allDocs.findIndex((m) => m.id === attachTo.id) + 1 : 0;

    allDocs.splice(newIndex, 0, model);

    return await this.chartDao.updateSortOrder(allDocs);
  }
}
