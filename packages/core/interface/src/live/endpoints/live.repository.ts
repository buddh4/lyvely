import { useApi } from '@/repository';
import type {} from 'axios';
import { API_LIVE, type ILiveEndpoint, LiveEndpoints } from './live.endpoint';
import type { ILiveSubscriptionState } from '../interfaces';

const api = useApi<ILiveEndpoint>(API_LIVE);

export default {
  async resumeState(state: ILiveSubscriptionState) {
    return api.post<'subscribeToUser'>(LiveEndpoints.RESUME, state);
  },

  async subscribeToUser(connectId: string, topic?: string) {
    return api.post<'subscribeToUser'>(LiveEndpoints.USER, {}, { params: { connectId, topic } });
  },

  async unsubscribeToUser(connectId: string, topic?: string) {
    return api.post<'subscribeToUser'>(LiveEndpoints.UNUSER, {}, { params: { connectId, topic } });
  },

  async subscribeToGlobal(connectId: string, topic?: string) {
    return api.post<'subscribeToGlobal'>(
      LiveEndpoints.GLOBAL,
      {},
      { params: { connectId, topic } }
    );
  },

  async unsubscribeToGlobal(connectId: string, topic?: string) {
    return api.post<'subscribeToGlobal'>(
      LiveEndpoints.UNGLOBAL,
      {},
      { params: { connectId, topic } }
    );
  },

  async subscribeToProfile(pid: string, connectId: string, topic?: string) {
    return api.post<'subscribeToProfile'>(
      LiveEndpoints.PROFILE(pid),
      {},
      { params: { connectId, topic } }
    );
  },

  async unsubscribeToProfile(pid: string, connectId: string, topic?: string) {
    return api.post<'subscribeToProfile'>(
      LiveEndpoints.UNPROFILE(pid),
      {},
      { params: { connectId, topic } }
    );
  },

  async subscribeToContent(pid: string, cid: string, connectId: string, topic?: string) {
    return api.post<'subscribeToContent'>(
      LiveEndpoints.CONTENT(pid, cid),
      {},
      { params: { connectId, topic } }
    );
  },

  async unsubscribeToContent(pid: string, cid: string, connectId: string, topic?: string) {
    return api.post<'subscribeToContent'>(
      LiveEndpoints.UNCONTENT(pid, cid),
      {},
      { params: { connectId, topic } }
    );
  },
};
