import { IPingResponse } from './ping.interface';
import { StrictEndpoint } from '@/endpoints';

export interface IPingClient {
  ping(): Promise<IPingResponse>;
}

export type PingEndpoint = StrictEndpoint<IPingClient>;

export const API_PING = 'ping';
