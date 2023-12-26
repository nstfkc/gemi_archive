import { Hono } from "hono";
import {
  type ViewRoute,
  type ViewRouteGroup,
  type LayoutGetter,
  ApiRoute,
  ApiRouteGroup,
} from "./Route";

export function createViewRoutes<
  T extends ViewRoute<any> | ViewRouteGroup<any>,
>(
  app: Hono,
  parentPath: string,
  config: { template: string; routeManifest: any; layoutGetter?: LayoutGetter },
  routes: Record<string, T>,
  renderToReadableStream: any,
  styles: string,
  scripts: string,
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
      renderToReadableStream,
      styles,
      scripts,
    });
  });
}

export type CreateViewRoutes = typeof createViewRoutes;

export function createApiRoutes<T extends ApiRoute<any> | ApiRouteGroup<any>>(
  app: Hono,
  parentPath: string,
  routes: Record<string, T>,
) {
  Object.entries(routes).forEach(([path, route]) => {
    route.handler(app, {
      path,
      parentPath,
      createApiRoutes,
    });
  });
}

export type CreateApiRoutes = typeof createApiRoutes;
