import { RouteLocationRaw, LocationQueryRaw } from 'vue-router';
import { UrlRoute } from '@lyvely/common';
export function profileRoot() {
  return '/p';
}

export function profileIdPath(pid: string, name?: string): string {
  return name ? `/pid/${pid}/${name}` : `/pid/${pid}`;
}

export function profileIdRoute(
  pid: string,
  options?: { viewName?: string; path?: string },
  query: LocationQueryRaw = {},
): RouteLocationRaw {
  if (options?.path) {
    query.path = options.path;
  }
  return { path: profileIdPath(pid, options?.viewName), query };
}

export function profileRoute(
  subPath = '/',
  handle = ':handle',
  query?: LocationQueryRaw,
): RouteLocationRaw {
  if (subPath.charAt(0) !== '/') {
    subPath = '/' + subPath;
  }

  const path = profilePath(subPath, handle);

  if (handle === ':handle') {
    return { path, query };
  }

  return { path, params: { handle }, query };
}

export function profilePath(subPath?: string, handle = ':handle'): string {
  const profilePath = `/p/${handle}`;

  if (!subPath) return profilePath;

  if (subPath.charAt(0) !== '/') {
    subPath = '/' + subPath;
  }

  return profilePath + subPath;
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
