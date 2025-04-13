import { useApi } from '@/repository';
import type {} from 'axios';
import { API_LIVE, type ILiveEndpoint, LiveEndpoints } from './live.endpoint';
import type { ILiveSubscriptionState } from '../interfaces';

const api = useApi<ILiveEndpoint>(API_LIVE);

export default {
  async resumeState(state: ILiveSubscriptionState) {
    return api.post<'subscribeToUser'>(LiveEndpoints.RESUME, state);
  },

  async subscribeToUser(topic?: string) {
    return api.post<'subscribeToUser'>(LiveEndpoints.USER, {}, { params: { topic } });
  },

  async unsubscribeToUser(topic?: string) {
    return api.post<'subscribeToUser'>(LiveEndpoints.UNUSER, {}, { params: { topic } });
  },

  async subscribeToGlobal(topic?: string) {
    return api.post<'subscribeToGlobal'>(LiveEndpoints.GLOBAL, {}, { params: { topic } });
  },

  async unsubscribeToGlobal(topic?: string) {
    return api.post<'subscribeToGlobal'>(LiveEndpoints.UNGLOBAL, {}, { params: { topic } });
  },

  async subscribeToProfile(pid: string, topic?: string) {
    return api.post<'subscribeToProfile'>(LiveEndpoints.PROFILE(pid), {}, { params: { topic } });
  },

  async unsubscribeToProfile(pid: string, topic?: string) {
    return api.post<'subscribeToProfile'>(LiveEndpoints.UNPROFILE(pid), {}, { params: { topic } });
  },

  async subscribeToContent(pid: string, cid: string, topic?: string) {
    return api.post<'subscribeToContent'>(
      LiveEndpoints.CONTENT(pid, cid),
      {},
      { params: { topic } }
    );
  },

  async unsubscribeToContent(pid: string, cid: string, topic?: string) {
    return api.post<'subscribeToContent'>(
      LiveEndpoints.UNCONTENT(pid, cid),
      {},
      { params: { topic } }
    );
  },
};
