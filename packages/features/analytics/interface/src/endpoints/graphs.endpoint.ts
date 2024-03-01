import { Endpoint, profileApiPrefix } from '@lyvely/interface';
import { GraphTypeResponse } from '../interfaces';

export interface IGraphsEndpointClient {
  getSeriesTypes(): Promise<GraphTypeResponse>;
}

export type GraphEndpoint = Endpoint<IGraphsEndpointClient>;
export const API_ANALYTICS_GRAPHS = profileApiPrefix('graphs');

export const GraphEndpointPaths = {
  GET_SERIES_TYPES: 'get-series-types',
};
