import { Hono } from "hono";
import { type ViewRoute, type ViewRouteGroup } from "./Route";

export function createViewRoutes<
  T extends ViewRoute<any> | ViewRouteGroup<any>,
>(
  app: Hono,
  config: { template: string; routeViewMap: any; layoutGetter?: any },
  routes: Record<string, T>,
) {
  Object.entries(routes).forEach(([path, route]) => {
    route.handler(app, {
      path,
      routeViewMap: config.routeViewMap,
      template: config.template,
      createViewRoutes,
      layoutGetter: config.layoutGetter ?? ((ctx: Hono) => (c) => c),
    });
  });
}

export type CreateViewRoutes = typeof createViewRoutes;
