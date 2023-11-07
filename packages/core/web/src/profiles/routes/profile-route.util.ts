import { RouteLocationRaw, LocationQueryRaw } from 'vue-router';
import { UrlRoute } from '@lyvely/common';
export function profileRoot() {
  return '/p';
}

export function profileIdRoute(pid?: ':pid', name?: string, query?: LocationQueryRaw): string;
export function profileIdRoute(
  pid?: string,
  name?: string,
  query?: LocationQueryRaw,
): RouteLocationRaw;
export function profileIdRoute(
  pid = ':pid',
  name = ':name',
  query?: LocationQueryRaw,
): RouteLocationRaw {
  const path = `/pid/${pid}${name}`;

  return pid === ':pid' ? path : { path: path, params: { pid, name }, query };
}

export function profileRoute(
  subPath: string | undefined,
  handle?: ':handle',
  query?: LocationQueryRaw,
): string;
export function profileRoute(
  subPath?: string,
  handle?: string,
  query?: LocationQueryRaw,
): RouteLocationRaw;
export function profileRoute(
  subPath = '/',
  handle = ':handle',
  query?: LocationQueryRaw,
): RouteLocationRaw {
  if (subPath.charAt(0) !== '/') {
    subPath = '/' + subPath;
  }

  const path = `/p/${handle}${subPath}`;
  handle ??= ':handle';

  return handle === ':handle' ? path : { path: path, params: { handle }, query };
}

export function namedProfileRoute(
  name: string,
  handle: string,
  query?: LocationQueryRaw,
): RouteLocationRaw {
  return { name, params: { handle }, query };
}

export function toVueRoute(route: UrlRoute): RouteLocationRaw {
  if ('handle' in route) {
    return profileRoute(route.path, route.handle as string, route.query);
  }

  return { path: route.path, query: route.query };
}
