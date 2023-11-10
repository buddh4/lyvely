import { profileIdRoute } from '@/profiles/routes/profile-route.helper';

export function contentRoute(pid: string, cid: string) {
  return profileIdRoute(pid, { path: `/stream/${cid}` });
}

export function toContentDetails({ id, pid }: { id: string; pid: string }) {
  return contentRoute(pid, id);
}
