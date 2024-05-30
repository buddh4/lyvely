import { RouteLocationRaw, LocationQueryRaw } from 'vue-router';
import { UrlRoute } from '@lyvely/interface';
export function profileRoot() {
  return '/p';
}

export function profileIdPath(pid: string, name?: string): string {
  return name ? `/pid/${pid}/${name}` : `/pid/${pid}`;
}

export function profileIdRoute(
  pid: string,
  options?: { viewName?: string; path?: string },
  query: LocationQueryRaw = {}
): RouteLocationRaw {
  if (options?.path) {
    query.path = options.path;
  }
  return { path: profileIdPath(pid, options?.viewName), query };
}

export function profilePathRoute(
  handle = ':handle',
  path = '/',
  query: LocationQueryRaw = {}
): RouteLocationRaw {
  return { path: profilePath(path, handle), query };
}

export function profileRoute(
  name: string,
  handle = ':handle',
  query?: LocationQueryRaw
): RouteLocationRaw {
  return { name, params: { handle }, query };
}

export function profilePath(subPath?: string, handle = ':handle'): string {
  const profilePath = `/p/${handle}`;
  if (!subPath) return profilePath;

  if (subPath.charAt(0) !== '/') {
    subPath = '/' + subPath;
  }

  return profilePath + subPath;
}

export function urlRoute(route: UrlRoute): RouteLocationRaw {
  const { path, query, pid } = route;
  return pid ? profileIdRoute(pid, { path }, query) : { path, query };
}
