import {
  ENDPOINT_CONTENT_STREAM,
  IContentStreamClient,
  IStreamRequest,
  useApiRepository,
} from '@lyvely/interface';
import { EndpointResult } from '@lyvely/common';

export default {
  async loadTail(request: IStreamRequest) {
    return useApiRepository().post<EndpointResult<IContentStreamClient['loadTail']>>(
      `${ENDPOINT_CONTENT_STREAM}/load-next`,
      request,
    );
  },

  async loadHead(request: IStreamRequest) {
    return useApiRepository().post<EndpointResult<IContentStreamClient['loadHead']>>(
      `${ENDPOINT_CONTENT_STREAM}/load-head`,
      request,
    );
  },

  async loadEntry(nid: string) {
    return useApiRepository().get<EndpointResult<IContentStreamClient['loadEntry']>>(
      `${ENDPOINT_CONTENT_STREAM}/${nid}`,
    );
  },
};
