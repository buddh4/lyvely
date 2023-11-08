import { profileIdRoute } from '@/profiles/routes/profile-route.util';

export function contentRoute(pid: string, cid: string) {
  return profileIdRoute(pid, { path: `/stream/${cid}` });
}

export function toContentDetails({ id, pid }: { id: string; pid: string }) {
  return contentRoute(pid, id);
}
