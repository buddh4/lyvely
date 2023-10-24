import { repository } from '@/core';
import {
  ENDPOINT_CONTENT_STREAM,
  IContentStreamClient,
  IStreamRequest,
} from '@lyvely/core-interface';
import { EndpointResult } from '@lyvely/common';

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
