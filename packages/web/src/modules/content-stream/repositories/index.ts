import repository from '@/repository';
import {
  ENDPOINT_CONTENT_STREAM,
  EndpointResult,
  IContentStreamClient,
  IStreamRequest,
} from '@lyvely/common';

export default {
  async loadNext(request: IStreamRequest) {
    return repository.post<EndpointResult<IContentStreamClient['loadNext']>>(
      `${ENDPOINT_CONTENT_STREAM}/load-next`,
      request,
    );
  },

  async update(request: IStreamRequest) {
    return repository.post<EndpointResult<IContentStreamClient['update']>>(
      `${ENDPOINT_CONTENT_STREAM}/update`,
      request,
    );
  },

  async loadEntry(nid: string) {
    return repository.get<EndpointResult<IContentStreamClient['loadEntry']>>(
      `${ENDPOINT_CONTENT_STREAM}/${nid}`,
    );
  },
};
