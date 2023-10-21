import { RouteLocationRaw, LocationQueryRaw } from 'vue-router';
import { UrlRoute } from '@lyvely/common';
export function profileRoot() {
  return '/p';
}

type PID = ':pid';

export function profileRoute(
  subPath: string | undefined,
  pid?: PID,
  query?: LocationQueryRaw,
): string;
export function profileRoute(
  subPath?: string,
  pid?: string,
  query?: LocationQueryRaw,
): RouteLocationRaw;
export function profileRoute(
  subPath = '/',
  pid = ':pid',
  query?: LocationQueryRaw,
): RouteLocationRaw {
  if (subPath.charAt(0) !== '/') {
    subPath = '/' + subPath;
  }

  const path = `/p/${pid}${subPath}`;

  return pid === ':pid' ? path : { path: path, params: { pid: pid }, query };
}

export function toVueRoute(route: UrlRoute): RouteLocationRaw {
  if ('pid' in route) {
    return profileRoute(route.path, route.pid, route.query);
  }

  return { path: route.path, query: route.query };
}
