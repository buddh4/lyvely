import { API_CONTENT_STREAM, IContentStreamClient } from './content-stream.endpoint';
import { IStreamRequest, StreamEndpoints } from '@/streams';
import { useApi } from '@/repository';
import { IProfileApiRequestOptions } from '@/endpoints';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IContentStreamClient>(API_CONTENT_STREAM);

export default {
  async loadTail(request: IStreamRequest, options?: IProfileApiRequestOptions) {
    return api.post<'loadTail'>(StreamEndpoints.TAIL, request, options);
  },

  async loadHead(request: IStreamRequest, options?: IProfileApiRequestOptions) {
    return api.post<'loadHead'>(StreamEndpoints.HEAD, request, options);
  },

  async loadEntry(nid: string, options?: IProfileApiRequestOptions) {
    return api.get<'loadEntry'>(nid, options);
  },
};
