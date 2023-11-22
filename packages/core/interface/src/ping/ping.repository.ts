import { useApi } from '@/repository';
import { ENDPOINT_PING, IPingClient } from './ping.endpoint';

const api = useApi<IPingClient>(ENDPOINT_PING);

export default {
  ping: async () => api.get<'ping'>(),
};
