import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { IContent } from '@lyvely/common';

export function contentRoute(pid: string, cid: string) {
  return profileRoute(`/stream/${cid}`, pid);
}

export function toContentDetails(content: IContent) {
  return contentRoute(content.pid, content.id);
}
