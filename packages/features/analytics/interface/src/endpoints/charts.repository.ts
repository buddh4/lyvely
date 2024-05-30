import { useApi, IProfileApiRequestOptions } from '@lyvely/interface';
import {
  API_ANALYTICS_CHARTS,
  ChartsEndpointPaths,
  IChartsEndpointClient,
} from './charts.endpoint';
import { CreateChartModel, UpdateChartModel, UpdateChartSeriesModel } from '../models';
import type { ISortRequest } from '@lyvely/interface';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IChartsEndpointClient>(API_ANALYTICS_CHARTS);

export default {
  /**
   * Fetches all charts of a profile.
   *
   * @param {IProfileApiRequestOptions} options - The options to customize the request.
   */
  async getCharts(options?: IProfileApiRequestOptions) {
    return api.get<'getCharts'>(options);
  },

  /**
   * Creates a new chart using the provided model.
   *
   * @param {CreateChartModel} model - The model object containing the data for the chart.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   */
  async create(model: CreateChartModel, options?: IProfileApiRequestOptions) {
    return api.post<'create'>(model, {}, options);
  },

  /**
   * Updates the chart with the given chart ID using the provided model.
   *
   * @param {string} chartId - The ID of the chart to be updated.
   * @param {UpdateChartModel} model - The chart model
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   */
  async update(chartId: string, model: UpdateChartModel, options?: IProfileApiRequestOptions) {
    return api.put<'update'>(chartId, model, options);
  },

  /**
   * Adds a series to a chart.
   *
   * @param {string} cid - The chart ID.
   * @param {UpdateChartSeriesModel} model - The series model to add.
   * @param {IProfileApiRequestOptions} [options] - Optional API request options.
   */
  async addSeries(cid: string, model: UpdateChartSeriesModel, options?: IProfileApiRequestOptions) {
    return api.post<'addSeries'>(ChartsEndpointPaths.ADD_SERIES(cid), model, options);
  },

  /**
   * Updates a series in a chart.
   *
   * @param {string} cid - The ID of the chart.
   * @param {string} sid - The ID of the series.
   * @param {UpdateChartSeriesModel} model - The updated series model.
   * @param {IProfileApiRequestOptions} [options] - The request options.
   */
  async updateSeries(
    cid: string,
    sid: string,
    model: UpdateChartSeriesModel,
    options?: IProfileApiRequestOptions
  ) {
    return api.put<'updateSeries'>(ChartsEndpointPaths.UPDATE_SERIES(cid, sid), model, options);
  },

  /**
   * Deletes a series from a chart.
   *
   * @param {string} cid - The ID of the chart.
   * @param {string} sid - The ID of the series to be deleted.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   */
  async deleteSeries(cid: string, sid: string, options?: IProfileApiRequestOptions) {
    return api.delete<'deleteSeries'>(ChartsEndpointPaths.DELETE_SERIES(cid, sid), options);
  },

  /**
   * Retrieves series data for a specified chart id.
   *
   * @param {string} cid - The chart id.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   */
  async getSeriesData(
    cid: string,
    query?: Record<string, string>,
    options?: IProfileApiRequestOptions
  ) {
    return api.get<'getSeriesData'>(ChartsEndpointPaths.SERIES_DATA(cid), {
      ...options,
      params: query,
    });
  },

  /**
   * Sorts the given chart.
   *
   * @param {string} cid - The ID of the chart.
   * @param {IProfileApiRequestOptions} [options] - Optional request options.
   */
  async sort(cid: string, sort: ISortRequest, options?: IProfileApiRequestOptions) {
    return api.post<'sort'>(ChartsEndpointPaths.SORT(cid), sort, options);
  },
};
