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
  parentPath: string,
  config: { template: string; routeManifest: any; layoutGetter?: LayoutGetter },
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
      parentPath,
      routeManifest: config.routeManifest,
      template: config.template,
      createViewRoutes,
      layoutGetter: config.layoutGetter ?? defaultLayoutGetter,
    });
  });
}

export type CreateViewRoutes = typeof createViewRoutes;
