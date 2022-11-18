import { Endpoint } from '@/endpoints';

export interface AbstractContentEndpointService {
  archive();
  unArchive();
}

export type AbstractContentEndpoint = Endpoint<AbstractContentEndpointService>;
