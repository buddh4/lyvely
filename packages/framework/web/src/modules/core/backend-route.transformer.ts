import { UrlRoute } from '@lyvely/common';
import { RouteLocationRaw } from 'vue-router';
import { profileRoute } from '@/modules/profiles/routes/profile-route.util';

export function toVueRoute(route: UrlRoute): RouteLocationRaw {
  if ('pid' in route) {
    return profileRoute(route.path, route.pid, route.query);
  }

  return { path: route.path, query: route.query };
}
