import { IChartsEndpointClient } from './charts.endpoint';
import {
  ChartListModel,
  ChartModel,
  ChartSeriesDataResponse,
  CreateChartModel,
  UpdateChartModel,
  UpdateChartResponseModel,
  UpdateChartSeriesModel,
} from '../models';
import repository from './charts.repository';
import { IProfileApiRequestOptions, unwrapAndTransformResponse } from '@lyvely/interface';
import { useSingleton } from '@lyvely/common';
import { ChartSeriesKeyValueArrayData } from '../interfaces';

/**
 * A client for interacting with charts API endpoint.
 * @implements IChartsEndpointClient
 */
export class ChartsClient implements IChartsEndpointClient {
  /**
   * Creates a new chart.
   *
   * @param {CreateChartModel} model - The data to create the chart.
   * @param {IProfileApiRequestOptions} [options] - The options for the API request.
   * @returns {Promise<UpdateChartResponseModel>} - The updated chart response model.
   */
  async create(
    model: CreateChartModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateChartResponseModel> {
    return unwrapAndTransformResponse(repository.create(model, options), UpdateChartResponseModel);
  }

  /**
   * Updates an existing chart record.
   *
   * @param {string} id - The ID of the chart to update.
   * @param {UpdateChartModel} model - The updated chart data.
   * @param {IProfileApiRequestOptions} [options] - Additional request options.
   * @returns {Promise<UpdateChartResponseModel>} - A Promise that resolves with the updated chart response.
   */
  async update(
    id: string,
    model: UpdateChartModel,
    options?: IProfileApiRequestOptions,
  ): Promise<UpdateChartResponseModel> {
    return unwrapAndTransformResponse(
      repository.update(id, model, options),
      UpdateChartResponseModel,
    );
  }

  /**
   * Adds a series to a chart.
   *
   * @param {string} cid - The ID of the chart.
   * @param {UpdateChartSeriesModel} model - The data model representing the series to be added.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   *
   * @returns {Promise<ChartModel>} - A promise that resolves to the updated chart model.
   */
  async addSeries(cid: string, model: UpdateChartSeriesModel, options?: IProfileApiRequestOptions) {
    return unwrapAndTransformResponse(repository.addSeries(cid, model, options), ChartModel);
  }

  /**
   * Updates a series in a chart.
   *
   * @param {string} cid - The identifier of the chart containing the series.
   * @param {string} sid - The identifier of the series to be updated.
   * @param {UpdateChartSeriesModel} model - The new data to update the series with.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   * @returns {Promise<ChartModel>} - A promise that resolves to the updated chart model.
   */
  async updateSeries(
    cid: string,
    sid: string,
    model: UpdateChartSeriesModel,
    options?: IProfileApiRequestOptions,
  ) {
    return unwrapAndTransformResponse(
      repository.updateSeries(cid, sid, model, options),
      ChartModel,
    );
  }

  /**
   * Deletes a series from a chart.
   *
   * @param {string} cid - The ID of the chart.
   * @param {string} sid - The ID of the series to delete.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   * @returns {Promise<void>} - A promise that resolves when the series is deleted.
   */
  async deleteSeries(cid: string, sid: string, options?: IProfileApiRequestOptions) {
    return unwrapAndTransformResponse(repository.deleteSeries(cid, sid, options), ChartModel);
  }

  /**
   * Retrieves a list of charts.
   *
   * @param {IProfileApiRequestOptions} options - TOptional request options.
   * @return {Promise<ChartListModel>} - The promise that resolves to the list of charts.
   */
  async getCharts(options?: IProfileApiRequestOptions): Promise<ChartListModel> {
    return unwrapAndTransformResponse(repository.getCharts(options), ChartListModel);
  }

  /**
   * Retrieve series data for a given chart id.
   *
   * @param {string} cid - The chart id.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   * @returns {Promise<ChartSeriesDataResponse>} - A promise that resolves to the chart series data response.
   */
  async getSeriesData(
    cid: string,
    options?: IProfileApiRequestOptions,
  ): Promise<ChartSeriesDataResponse> {
    return unwrapAndTransformResponse(
      repository.getSeriesData(cid, options),
      ChartSeriesDataResponse,
    );
  }
}

/**
 * Factory function for creating a singleton instance of ChartsClient.
 *
 * @returns {ChartsClient} The singleton instance of the ChartsClient class.
 */
export const useChartsClient = useSingleton(() => new ChartsClient());
