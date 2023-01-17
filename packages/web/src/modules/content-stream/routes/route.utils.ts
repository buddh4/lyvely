import { profileRoute } from '@/modules/profiles/routes/profile-route.util';
import { ContentModel } from '@lyvely/common';

export function contentRoute(pid: string, cid: string) {
  return profileRoute(`/stream/${cid}`, pid);
}

export function toContentDetails(content: ContentModel) {
  return contentRoute(content.pid, content.id);
}
