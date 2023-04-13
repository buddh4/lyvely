import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { IContent } from '@lyvely/common';

export function contentRoute(pid: string, cid: string) {
  return profileRoute(`/stream/${cid}`, pid);
}

export function toContentDetails({ id, pid }: { id: string; pid: string }) {
  return contentRoute(pid, id);
}
