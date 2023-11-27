import { ENDPOINT_CONTENT_STREAM, IContentStreamClient } from './content-stream.endpoint';
import { IStreamRequest, StreamEndpointPaths } from '@/streams';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';

const api = useApi<IContentStreamClient>(ENDPOINT_CONTENT_STREAM);

export default {
  async loadTail(request: IStreamRequest, options?: IProfileApiRequestOptions) {
    return api.post<'loadTail'>(StreamEndpointPaths.TAIL, request, options);
  },

  async loadHead(request: IStreamRequest, options?: IProfileApiRequestOptions) {
    return api.post<'loadHead'>(StreamEndpointPaths.HEAD, request, options);
  },

  async loadEntry(nid: string, options?: IProfileApiRequestOptions) {
    return api.get<'loadEntry'>(nid, options);
  },
};
