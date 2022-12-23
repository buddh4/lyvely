import { Endpoint } from '@/endpoints';

export interface AbstractContentEndpointService {
  archive(contentId: string);
  unArchive(contentId: string);
}

export type AbstractContentEndpoint = Endpoint<AbstractContentEndpointService>;
