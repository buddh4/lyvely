import { useApi } from '@/repository';
import { API_PING, IPingClient } from './ping.endpoint';
// TODO: https://github.com/microsoft/TypeScript/issues/47663
import type {} from 'axios';

const api = useApi<IPingClient>(API_PING);

export default {
  ping: async () => api.get<'ping'>(),
};
