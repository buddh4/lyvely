import { createApiUrl } from '@lyvely/interface';

// TODO (file) this is just a dummy implementation, and does not work at the moment...
export function createFileUrl(hash: string) {
  return createApiUrl('/files/' + hash);
}
