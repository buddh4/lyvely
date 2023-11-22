import { ENDPOINT_CONTENT_STREAM, IContentStreamClient } from './content-stream.endpoint';
import { IStreamRequest, StreamEndpointPaths } from '@/streams';
import { useApi } from '@/repository';

const api = useApi<IContentStreamClient>(ENDPOINT_CONTENT_STREAM);

export default {
  async loadTail(request: IStreamRequest) {
    return api.post<'loadTail'>(StreamEndpointPaths.TAIL, request);
  },

  async loadHead(request: IStreamRequest) {
    return api.post<'loadHead'>(StreamEndpointPaths.HEAD, request);
  },

  async loadEntry(nid: string) {
    return api.get<'loadEntry'>(nid);
  },
};
