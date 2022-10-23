import { RouteRecordRaw } from 'vue-router';

export default function (register: (registerRoutes: Array<RouteRecordRaw>) => void) {
  const moduleRoutes = <{ default: Array<RouteRecordRaw> }[]>(
    import.meta.glob('../modules/**/routes/index.ts', { eager: true })
  );

  for (const path in moduleRoutes) {
    const route = moduleRoutes[path];
    if (route.default) {
      register(route.default);
    }
  }
}
