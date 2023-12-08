import { useApi } from '@/repository';
import { API_PING, IPingClient } from './ping.endpoint';

const api = useApi<IPingClient>(API_PING);

export default {
  ping: async () => api.get<'ping'>(),
};
