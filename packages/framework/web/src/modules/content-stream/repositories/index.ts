import repository from '@/repository';
import {
  ENDPOINT_CONTENT_STREAM,
  EndpointResult,
  IContentStreamClient,
} from '@lyvely/content-interface';
import { IStreamRequest } from '@lyvely/streams-interface';

export default {
  async loadTail(request: IStreamRequest) {
    return repository.post<EndpointResult<IContentStreamClient['loadTail']>>(
      `${ENDPOINT_CONTENT_STREAM}/load-next`,
      request,
    );
  },

  async loadHead(request: IStreamRequest) {
    return repository.post<EndpointResult<IContentStreamClient['loadHead']>>(
      `${ENDPOINT_CONTENT_STREAM}/load-head`,
      request,
    );
  },

  async loadEntry(nid: string) {
    return repository.get<EndpointResult<IContentStreamClient['loadEntry']>>(
      `${ENDPOINT_CONTENT_STREAM}/${nid}`,
    );
  },
};