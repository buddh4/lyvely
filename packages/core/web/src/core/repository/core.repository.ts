import { useApiRepository, createApiUrl as createApiRepositoryUrl } from '@lyvely/core-interface';

// Only used for compatibility
export const createApiUrl = createApiRepositoryUrl;

// TODO (file) this is just a dummy implementation, and does not work at the moment...
export function createFileUrl(hash: string) {
  return createApiUrl('/files/' + hash);
}
