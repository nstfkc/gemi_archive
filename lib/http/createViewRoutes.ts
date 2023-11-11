import { Hono } from "hono";
import {
  type ViewRoute,
  type ViewRouteGroup,
  type LayoutGetter,
} from "./Route";

export function createViewRoutes<
  T extends ViewRoute<any> | ViewRouteGroup<any>,
>(
  app: Hono,
  config: { template: string; routeViewMap: any; layoutGetter?: LayoutGetter },
  routes: Record<string, T>,
) {
  const defaultLayoutGetter: LayoutGetter = (_ctx) => {
    return Promise.resolve({
      wrapper: (children) => children,
      data: {},
    });
  };
  Object.entries(routes).forEach(([path, route]) => {
    route.handler(app, {
      path,
      routeViewMap: config.routeViewMap,
      template: config.template,
      createViewRoutes,
      layoutGetter: config.layoutGetter ?? defaultLayoutGetter,
    });
  });
}

export type CreateViewRoutes = typeof createViewRoutes;