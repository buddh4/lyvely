import repository from './ping.repository';
import { unwrapResponse } from '@/core';
import { useSingleton } from '@lyvely/common';

class PingService {
  async ping(): Promise<boolean> {
    try {
      await unwrapResponse(repository.ping());
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const usePingService = useSingleton(() => new PingService());
