import { useApi } from '@/repository';
import type {} from 'axios';
import { API_LIVE, type ILiveEndpoint, LiveEndpoints } from './live.endpoint';

const api = useApi<ILiveEndpoint>(API_LIVE);

export default {
  async subscribeToUser(topic?: string) {
    return api.post<'subscribeToUser'>(LiveEndpoints.USER, {}, { params: { topic } });
  },

  async subscribeToGlobal(topic?: string) {
    return api.post<'subscribeToGlobal'>(LiveEndpoints.GLOBAL, {}, { params: { topic } });
  },

  async subscribeToProfile(pid: string, topic?: string) {
    return api.post<'subscribeToProfile'>(LiveEndpoints.PROFILE(pid), {}, { params: { topic } });
  },

  async subscribeToContent(pid: string, cid: string, topic?: string) {
    return api.post<'subscribeToContent'>(
      LiveEndpoints.CONTENT(pid, cid),
      {},
      { params: { topic } }
    );
  },
};
